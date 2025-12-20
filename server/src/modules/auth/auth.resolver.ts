import { Resolver, Mutation, Args, Context } from '@nestjs/graphql'
import { UseGuards, UseInterceptors } from '@nestjs/common'
import { AuthGuard } from '@common/guards/auth.guard.js'
import { RegisterPipe } from '@common/pipes/auth/register.pipe.js'
import { RegisterInterceptor } from '@common/interceptors/auth/register.interceptor.js'
import { SettingsPipe } from '@common/pipes/auth/settings.pipe.js'
import { SettingsInterceptor } from '@common/interceptors/auth/settings.interceptor.js'
import { RegisterService } from './services/register.service.js'
import { VerifyService } from './services/verify.service.js'
import { ResendService } from './services/resend.service.js'
import { LoginService } from './services/login.service.js'
import { SettingService } from './services/settings.service.js'
import { LogoutService } from './services/logout.service.js'
import { Register } from './dto/register.dto.js'
import { Verify } from './dto/verify.dto.js'
import { Login } from './dto/login.dto.js'
import { Settings } from './dto/settings.dto.js'
import type { RegisterResult, LoginResult } from '@type/auth/auth-result.d.ts'
import type { User } from '@type/auth/user.d.ts'

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
    @Mutation(() => String)
    async register(@Args(RegisterPipe) args: Register): Promise<RegisterResult> {
        return this.registerService.register(args)
    }
    @UseGuards(AuthGuard)
    @Mutation(() => Boolean)
    async verify(
        @Args() args: Verify,
        @Context() ctx: { user: User }
    ): Promise<true> {
        return this.verifyService.verify(args, ctx.user)
    }
    @UseGuards(AuthGuard)
    @Mutation(() => Boolean)
    async resend(@Context() ctx: { user: User }): Promise<true> {
        return this.resendService.resend(ctx.user)
    }
    @Mutation(() => String)
    async login(@Args() args: Login): Promise<LoginResult> {
        return this.loginService.login(args)
    }
    @UseGuards(AuthGuard)
    @UseInterceptors(SettingsInterceptor)
    @Mutation(() => Boolean)
    async settings(
        @Args(SettingsPipe) args: Settings,
        @Context() ctx: { user: User }
    ): Promise<true> {
        await this.settingService.settings(args, ctx.user)
        return true
    }
    @UseGuards(AuthGuard)
    @Mutation(() => Boolean)
    async logout(@Context() ctx: { req: Req, user: User }): Promise<true> {
        return this.logoutService.logout(ctx)
    }
}