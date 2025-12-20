import { Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/database/prisma.service.js'
import { RedisService } from '@infrastructure/cache/services/redis.service.js'
import { SecurityService } from '@shared/utils/services/security.service.js'
import type { Settings } from '../dto/settings.dto.js'
import type { User, UserSettings } from '@type/auth/user.js'

@Injectable()
export class SettingService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly redisService: RedisService,
        private readonly securityService: SecurityService
    ) {}
    async settings(args: Settings, user: User): Promise<boolean> {
        const { photo, name, username, email, oldPass, newPass } = args
        const authUser = await this.prismaService.user.findUnique({ where: { id: user.id } })
        const errors: Record<string, string> = {}
        if (authUser!.pass !== null) {
            if (oldPass && !newPass) errors['newPass'] = 'New password can\'t be empty!'
            if ((newPass && !oldPass) || (newPass && !(await this.securityService.verifyHash(oldPass!, authUser!.pass)))) errors['oldPass'] = 'Invalid current password'
            if (newPass && await this.securityService.verifyHash(newPass, authUser!.pass)) errors['newPass'] = 'The new password can\'t be the same as the current password!'
        } else if (authUser!.pass === null && oldPass) errors['oldPass'] = 'You don\'t need to enter current password!'
        const updateData: Partial<UserSettings> = {}
        const photoBuf = Buffer.from(photo, 'base64')
        if (photo && Buffer.from(authUser!.photo).equals(photoBuf)) updateData.photo = photo
        if (name && name !== authUser!.name) updateData.name = name
        if (username && username !== authUser!.username) updateData.username = username
        if (email && email !== authUser!.email) updateData.email = email
        if (newPass) updateData.pass = await this.securityService.hash(newPass)
        if (Object.keys(updateData).length > 0) {
            updateData.updated = new Date()
            const updateUser = await this.prismaService.user.update({
                where: { id: authUser!.id },
                data: {
                    ...updateData,
                    photo: Buffer.from(photo, 'base64')
                }
            })
            const key = this.securityService.sanitizeRedisKey('user', user.id)
            if (updateData.photo) await this.redisService.redis.json.SET(key, '$.photo', Buffer.from(updateUser!.photo).toString('base64'))
            if (updateData.name) await this.redisService.redis.json.SET(key, '$.name', updateUser!.name)
            if (updateData.username) await this.redisService.redis.json.SET(key, '$.username', updateUser!.username)
            if (updateData.email) await this.redisService.redis.json.SET(key, '$.email', updateUser!.email)
        }
        return true
    }
}