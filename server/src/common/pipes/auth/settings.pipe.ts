import { Injectable, type PipeTransform } from '@nestjs/common'
import { ApolloServerErrorCode } from '@apollo/server/errors'
import { ValidationService } from '@shared/utils/services/validation.service.js'
import { FormatterService } from '@shared/utils/services/formatter.service.js'
import type { BaseUser } from '@type/auth/user.d.ts'

@Injectable()
export class SettingsPipe implements PipeTransform {
    constructor(
        private readonly validationService: ValidationService,
        private readonly formatterService: FormatterService
    ) {}
    async transform(value: BaseUser & { newPass: string, rePass: string, show: boolean }): Promise<BaseUser & {
        newPass: string
        rePass: string
        show: boolean
    }> {
        const { photo, name, username, email, newPass, rePass, show } = value
        const errors: Record<string, string> = {}
        const nameError = this.validationService.validateName(name)
        const usernameError = await this.validationService.validateUsername(username)
        const emailError = await this.validationService.validateEmail(email)
        if (Buffer.byteLength(photo, 'base64') > 5592405) errors['photo'] = 'Image size must not exceed 8MB (MiB)'
        if (nameError) errors['name'] = nameError
        if (usernameError) errors['username'] = usernameError
        if (emailError) errors['email'] = emailError
        if (!show && newPass !== rePass) errors['rePass'] = 'Password do not match!'
        if (Object.keys(errors).length > 0) throw { code: ApolloServerErrorCode.BAD_USER_INPUT, errors }
        return {
            ...value,
            name: this.formatterService.formatName(name),
            username: this.formatterService.formatUsername(username)
        }
    }
}