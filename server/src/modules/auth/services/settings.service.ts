import { Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/database/prisma.service.js'
import { SecurityService } from '@shared/utils/services/security.service.js'
import { FormatterService } from '@shared/utils/services/formatter.service.js'
import type { Settings } from '../dto/settings.dto.js'
import type { User, UserSettings } from '@type/user.js'

@Injectable()
export class SettingService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly securityService: SecurityService,
        private readonly formatterService: FormatterService,
    ) {}
    async settings(args: Settings, res: Res, user: User) {
        const { photo, name, username, email, oldPass, newPass } = args
        const authUser = await this.prismaService.user.findUnique({ where: { id: user.id } })
        const errors: Record<string, string> = {}
        if (authUser!.pass !== null) {
            if (oldPass && !newPass) errors['newPass'] = 'New password can\'t be empty!'
            if ((newPass && !oldPass) || (newPass && !(await this.securityService.verifyHash(oldPass!, authUser!.pass)))) errors['oldPass'] = 'Invalid current password'
            if (newPass && await this.securityService.verifyHash(newPass, authUser!.pass)) errors['newPass'] = 'The new password can\'t be the same as the current password!'
        } else if (authUser!.pass === null && oldPass) errors['oldPass'] = 'You don\'t need to enter current password!'
        const updateData: Partial<UserSettings> = {}
        if (photo && Buffer.from(photo, 'base64') !== authUser!.photo) updateData.photo = photo
        if (name && name !== authUser!.name) updateData.name = this.formatterService.formatName(name)
        if (username && username !== authUser!.username) updateData.username = this.formatterService.formatUsername(username)
        if (email && email !== authUser!.email) updateData.email = email
        if (newPass) updateData.pass = await this.securityService.hash(newPass)
        if (Object.keys(updateData).length > 0) {
            updateData.updated = new Date()
            const updateUser = await userModel.findByIdAndUpdate(authUser._id, { ...updatedUser, photo: Buffer.from(photo, 'base64') }, { new: true }).lean()
            if (updateData.photo) await Redis.json.SET(key, '$.photo', newCache!.photo.toString('base64'))
            if (updateData.name) await Redis.json.SET(key, '$.name', newCache!.name)
            if (updateData.username) await Redis.json.SET(key, '$.username', newCache!.username)
            if (updateData.email) await Redis.json.SET(key, '$.email', newCache!.email)
        }
        return true
    }
}