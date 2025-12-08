import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql'
import { RegisterPipe } from '@common/pipes/auth/register.pipe.js'
import { RegisterService } from './services/register.service.js'
import { VerifyService } from './services/verify.service.js'
import { ResendService } from './services/resend.service.js'
import { LoginService } from './services/login.service.js'
import { Register } from './dto/register.dto.js'
import { Verify } from './dto/verify.dto.js'
import { Login } from './dto/login.dto.js'
import type { User } from '@type/user.d.ts'

@Resolver()
export class AuthResolver {
    constructor(
        private readonly registerService: RegisterService,
        private readonly verifyService: VerifyService,
        private readonly resendService: ResendService,
        private readonly loginService: LoginService
    ) { }
    @Query(() => Boolean)
    halt() {
        return true
    }
    @Mutation(() => Boolean)
    async register(
        @Args(RegisterPipe) args: Register,
        @Context() context: { req: Req, res: Res }
    ): Promise<boolean> {
        const { req, res } = context
        return this.registerService.register(args, req, res)
    }
    @Mutation(() => Boolean)
    async verify(
        @Args() args: Verify,
        @Context() context: { user: User }
    ): Promise<boolean> {
        return this.verifyService.verify(args, context.user)
    }
    @Mutation(() => Boolean)
    async resend(
        @Context() context: { user: User }
    ): Promise<boolean> {
        return this.resendService.resend(context.user)
    }
    @Mutation(() => Boolean)
    async login(
        @Args() args: Login,
        @Context() context: { res: Res }
    ): Promise<boolean> {
        return this.loginService.login(args, context.res)
    }
}