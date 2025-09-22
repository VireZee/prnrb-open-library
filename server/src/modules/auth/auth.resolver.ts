import { Resolver, Mutation, Args, Context } from '@nestjs/graphql'
import type { PrismaService } from '@database/prisma.service.js'
import type { ValidationService } from '@shared/utils/validation/validation.service.js'
import type { FormatterService } from '@shared/utils/formatter/formatter.service.js'
import type { MiscService } from '@shared/utils/misc/misc.service.js'
import type { SecurityService } from '@shared/utils/security/security.service.js'
import type { Register } from './dto/register.dto.js'

@Resolver()
export class AuthResolver {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly validationService: ValidationService,
        private readonly formatterService: FormatterService,
        private readonly miscService: MiscService,
        private readonly securityService: SecurityService
    ) {}
    @Mutation(() => Boolean)
    async register(
        @Args('input') input: Register,
        @Context() context: { res: Res }
    ) {
        const { name, username, email, pass, rePass, show } = input
        const { res } = context
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
        await this.prismaService.user.create({
            data: {
                photo: Buffer.from(this.miscService.generateAvatar(name), 'base64'),
                name: this.formatterService.formatName(name),
                username: this.formatterService.formatUsername(username),
                email,
                pass: await this.securityService.hashService.hash(pass)
            }
        })
        // await generateCode('verify', newUser, false)
        // cookie(newUser, res)
        return true
    }
}