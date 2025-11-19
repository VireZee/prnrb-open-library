import { Injectable, type PipeTransform } from '@nestjs/common'
import type { ValidationService } from '@shared/utils/validation/validation.service.js'

@Injectable()
export class RegisterPipe implements PipeTransform {
    constructor(private readonly validationService: ValidationService) {}
    async transform(value: { name: string, username: string, email: string, pass: string, rePass: string, show: boolean }): Promise<{
        name: string
        username: string
        email: string
        pass: string
        rePass: string
        show: boolean
    }> {
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
        if (Object.keys(errors).length > 0) this.miscService.graphqlError('Unprocessable Content', errors)
        return value
    }
}