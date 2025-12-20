import { Resolver, Mutation, Args, Context } from '@nestjs/graphql'
import { UseGuards, UseInterceptors } from '@nestjs/common'
import { AuthGuard } from '@common/guards/auth.guard.js'
import { RegisterPipe } from '@common/pipes/auth/register.pipe.js'
import { SettingsPipe } from '@common/pipes/auth/settings.pipe.js'
import { RegisterService } from './services/register.service.js'
import { VerifyService } from './services/verify.service.js'
import { ResendService } from './services/resend.service.js'
import { LoginService } from './services/login.service.js'
import { SettingService } from './services/settings.service.js'
import { LogoutService } from './services/logout.service.js'
import { Register } from './dto/register.dto.js'
import { Settings } from './dto/settings.dto.js'
import { Verify } from './dto/verify.dto.js'
import { Login } from './dto/login.dto.js'
import type { User } from '@type/auth/user.js'
import { RegisterInterceptor } from '@common/interceptors/register.interceptor.js'
import type RegisterResult from '@type/auth/register-result.js'

@Resolver()
export class AuthResolver {
    constructor(
        private readonly registerService: RegisterService,
        private readonly verifyService: VerifyService,
        private readonly resendService: ResendService,
        private readonly loginService: LoginService,
        private readonly settingService: SettingService,
        private readonly logoutService: LogoutService
    ) {}
    @UseInterceptors(RegisterInterceptor)
    @Mutation(() => Boolean)
    async register(@Args(RegisterPipe) args: Register): Promise<RegisterResult> {
        return this.registerService.register(args)
    }
    @UseGuards(AuthGuard)
    @Mutation(() => Boolean)
    async verify(
        @Args() args: Verify,
        @Context() ctx: { user: User }
    ): Promise<boolean> {
        return this.verifyService.verify(args, ctx.user)
    }
    @Mutation(() => Boolean)
    async resend(@Context() ctx: { user: User }): Promise<boolean> {
        return this.resendService.resend(ctx.user)
    }
    @Mutation(() => Boolean)
    async login(
        @Args() args: Login,
        @Context() ctx: ReqRes
    ): Promise<string> {
        return this.loginService.login(args, ctx)
    }
    @UseGuards(AuthGuard)
    @Mutation(() => Boolean)
    async settings(
        @Args(SettingsPipe) args: Settings,
        @Context() ctx: { user: User }
    ): Promise<boolean> {
        return this.settingService.settings(args, ctx.user)
    }
    @UseGuards(AuthGuard)
    @Mutation(() => Boolean)
    async logout(@Context() ctx: ReqRes & { user: User }): Promise<boolean> {
        return this.logoutService.logout(ctx)
    }
}