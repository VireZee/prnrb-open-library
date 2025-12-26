import { Injectable, type PipeTransform } from '@nestjs/common'
import { ApolloServerErrorCode } from '@apollo/server/errors'
import { ValidationService } from '@shared/utils/services/validation.service.js'
import { FormatterService } from '@shared/utils/services/formatter.service.js'
import type { Register } from '@modules/auth/dto/register.dto.d.ts'

@Injectable()
export class RegisterPipe implements PipeTransform {
    constructor(
        private readonly validationService: ValidationService,
        private readonly formatterService: FormatterService
    ) {}
    async transform(value: Omit<Register, 'identity'>): Promise<Omit<Register, 'identity'>> {
        const { name, username, email, pass, rePass, show } = value
        const errors: Record<string, string> = {}
        const nameError = this.validationService.validateName(name)
        const usernameError = await this.validationService.validateUsername(username)
        const emailError = await this.validationService.validateEmail(email)
        if (nameError) errors['name'] = nameError
        if (usernameError) errors['username'] = usernameError
        if (emailError) errors['email'] = emailError
        if (!pass) errors['pass'] = 'Password can\'t be empty!'
        if (!show && pass !== rePass) errors['rePass'] = 'Password do not match!'
        if (Object.keys(errors).length > 0) throw { code: ApolloServerErrorCode.BAD_USER_INPUT, errors }
        return {
            ...value,
            name: this.formatterService.formatName(name),
            username: this.formatterService.formatUsername(username)
        }
    }
}
