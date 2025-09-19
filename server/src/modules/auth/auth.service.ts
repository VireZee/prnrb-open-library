import { Injectable } from '@nestjs/common'
import type { PrismaService } from 'database/prisma.service.js'
import type { Register } from './dto/register.dto.js'
import nameValidator from '@utils/validators/name.validator.js'
import usernameValidator from '@utils/validators/username.validator.js'
import emailValidator from '@utils/validators/email.validator.js'

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService) { }
    async register(model: Register, res: any) {
        const { name, username, email, pass, rePass, show } = model
        const errors: Record<string, string> = {}
        const nameError = nameValidator(name)
        const usernameError = await usernameValidator(this.prisma, username)
        const emailError = await emailValidator(this.prisma, email)
        if (nameError) errors['name'] = nameError
        if (usernameError) errors['username'] = usernameError
        if (emailError) errors['email'] = emailError
        if (!pass) errors['pass'] = "Password can't be empty!"
        if (!show && pass !== rePass) errors['rePass'] = 'Password do not match!'
        // if (Object.keys(errors).length > 0) graphqlError('Unprocessable Content', 422, errors)
        const newUser = await this.prisma.user.create({
            data: {
                photo: Buffer.from(generateSvg(name), 'base64'),
                name: formatName(name),
                username: formatUsername(username),
                email,
                pass: await hash(pass),
            }
        })
        await generateCode('verify', newUser.id, false)
        res.cookie('token', 'TODO-JWT', { httpOnly: true })
        return true
    }
}