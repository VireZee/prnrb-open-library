import { Injectable } from '@nestjs/common'
import { ApolloServerErrorCode } from '@apollo/server/errors'
import { PrismaService } from '@infrastructure/database/prisma.service.js'
import { PublisherService } from '@infrastructure/redis/services/publisher.service.js'
import { SecurityService } from '@shared/utils/services/security.service.js'
import { ValidationService } from '@shared/utils/services/validation.service.js'
import type { Settings } from '../dto/settings.dto.js'
import type { User, UserSettings } from '@type/auth/user.d.ts'

@Injectable()
export class SettingService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly publisherService: PublisherService,
        private readonly securityService: SecurityService,
        private readonly validationService: ValidationService
    ) {}
    async settings(args: Settings, user: User): Promise<true> {
        const { photo, name, username, email, oldPass, newPass } = args
        const authUser = await this.prismaService.user.findUnique({ where: { id: user.id } })
        const errors: Record<string, string> = {}
        const usernameError = await this.validationService.validateUsername(username, user.id)
        const emailError = await this.validationService.validateEmail(email, user.id)
        if (usernameError) errors['username'] = usernameError
        if (emailError) errors['email'] = emailError
        if (authUser!.pass !== null) {
            if (oldPass && !newPass) errors['newPass'] = 'New password can\'t be empty!'
            if ((newPass && !oldPass) || (newPass && !(await this.securityService.verifyHash(oldPass!, authUser!.pass)))) errors['oldPass'] = 'Invalid current password'
            if (newPass && await this.securityService.verifyHash(newPass, authUser!.pass)) errors['newPass'] = 'The new password can\'t be the same as the current password!'
        } else if (authUser!.pass === null && oldPass) errors['oldPass'] = 'You don\'t need to enter current password!'
        if (Object.keys(errors).length > 0) throw { code: ApolloServerErrorCode.BAD_USER_INPUT, errors }
        const update: Partial<UserSettings> = {}
        const photoBuf = Buffer.from(photo, 'base64')
        if (photo && !Buffer.from(authUser!.photo).equals(photoBuf)) update.photo = photo
        if (name && name !== authUser!.name) update.name = name
        if (username && username !== authUser!.username) update.username = username
        if (email && email !== authUser!.email) update.email = email
        if (newPass) update.pass = await this.securityService.hash(newPass)
        if (Object.keys(update).length > 0) {
            update.updated = new Date()
            await this.prismaService.user.update({
                where: { id: authUser!.id },
                data: {
                    ...update,
                    photo: Buffer.from(photo, 'base64')
                }
            })
            this.publisherService.publish('user:update', JSON.stringify({
                id: user.id,
                update
            }))
        }
        return true
    }
}