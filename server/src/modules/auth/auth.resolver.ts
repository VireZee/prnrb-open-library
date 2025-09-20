import { Resolver, Mutation, Args, Context } from '@nestjs/graphql'
import type { PrismaService } from '@database/prisma.service.js'
import type { ValidationService } from '@shared/validation/validation.service.js'
import type { FormatterService } from '@shared/formatter/formatter.service.js'
import type { GenerateSvgService } from '@shared/misc/generate-svg.service.js'
import type { HashService } from '@shared/security/hash.service.js'

@Resolver()
export class AuthResolver {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly validationService: ValidationService,
        private readonly formatterService: FormatterService,
        private readonly generateSvgService: GenerateSvgService,
        private readonly hashService: HashService
    ) { }
    @Mutation(() => Boolean)
    async register(
        @Args('name') name: string,
        @Args('username') username: string,
        @Args('email') email: string,
        @Args('pass') pass: string,
        @Args('rePass') rePass: string,
        @Args('show') show: boolean,
        @Context() context: { res: Res },
    ) {
        try {
            // const { res } = context;
            const errors: Record<string, string> = {}
            const nameError = this.validationService.validateName(name)
            const usernameError = await this.validationService.validateUsername(username)
            const emailError = await this.validationService.validateEmail(email)
            if (nameError) errors['name'] = nameError
            if (usernameError) errors['username'] = usernameError
            if (emailError) errors['email'] = emailError
            if (!pass) errors['pass'] = 'Password can\'t be empty!'
            if (!show && pass !== rePass) errors['rePass'] = 'Password do not match!'
            // if (Object.keys(errs).length > 0) {
            //     graphqlError('Unprocessable Content', 422, errs);
            // }
            await this.prismaService.user.create({
                data: {
                    photo: Buffer.from(this.generateSvgService.generateSvg(name), 'base64'),
                    name: this.formatterService.formatName(name),
                    username: this.formatterService.formatUsername(username),
                    email,
                    pass: await this.hashService.hash(pass),
                }
            })
            // await generateCode('verify', newUser, false)
            // cookie(newUser, res)
            // return true
        } catch (e) {
            throw e
        }
    }
}