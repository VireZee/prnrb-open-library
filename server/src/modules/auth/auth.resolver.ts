import { UseGuards, UseInterceptors } from '@nestjs/common'
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql'
import { AuthGuard } from '@common/guards/auth.guard.js'
import { RegisterInterceptor } from '@common/interceptors/auth/register.interceptor.js'
import { RegisterPipe } from '@common/pipes/auth/register.pipe.js'
import { LoginInterceptor } from '@common/interceptors/auth/login.interceptor.js'
import { LoginPipe } from '@common/pipes/auth/login.pipe.js'
import { SettingsPipe } from '@common/pipes/auth/settings.pipe.js'
import { LogoutInterceptor } from '@common/interceptors/auth/clear-cookies.interceptor.js'
import { ForgetPipe } from '@common/pipes/auth/forget.pipe.js'
import { ResetPipe } from '@common/pipes/auth/reset.pipe.js'
import { RegisterService } from './services/register.service.js'
import { VerifyService } from './services/verify.service.js'
import { ResendService } from './services/resend.service.js'
import { LoginService } from './services/login.service.js'
import { SettingService } from './services/settings.service.js'
import { LogoutService } from './services/logout.service.js'
import { ForgetService } from './services/forget.service.js'
import { ValidateService } from './services/validate.service.js'
import { ResetService } from './services/reset.service.js'
import { TerminateService } from './services/terminate.service.js'
import { Auth } from './dto/auth.dto.js'
import { Register } from './dto/register.dto.js'
import { Verify } from './dto/verify.dto.js'
import { Login } from './dto/login.dto.js'
import { Settings } from './dto/settings.dto.js'
import { Forget } from './dto/forget.dto.js'
import { Validate } from './dto/validate.dto.js'
import { Reset } from './dto/reset.dto.js'
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
        private readonly logoutService: LogoutService,
        private readonly forgetService: ForgetService,
        private readonly validateService: ValidateService,
        private readonly resetService: ResetService,
        private readonly terminateService: TerminateService
    ) {}
    @UseGuards(AuthGuard)
    @Query(() => Auth)
    auth(@Context('req') req: Req): User | undefined { return req.user }
    @UseInterceptors(RegisterInterceptor)
    @Mutation(() => String)
    async register(@Args(RegisterPipe) args: Register): Promise<RegisterResult> { return this.registerService.register(args) }
    @UseGuards(AuthGuard)
    @Mutation(() => Boolean)
    async verify(
        @Args() args: Verify,
        @Context('req') ctx: { user: User }
    ): Promise<true> { return this.verifyService.verify(args, ctx.user) }
    @UseGuards(AuthGuard)
    @Mutation(() => Boolean)
    async resend(@Context('req') ctx: { user: User }): Promise<true> { return this.resendService.resend(ctx.user) }
    @UseInterceptors(LoginInterceptor)
    @Mutation(() => String)
    async login(@Args(LoginPipe) args: Login): Promise<LoginResult> { return this.loginService.login(args) }
    @UseGuards(AuthGuard)
    @Mutation(() => Boolean)
    async settings(
        @Args(SettingsPipe) args: Settings,
        @Context('req') ctx: { user: User }
    ): Promise<true> { return this.settingService.settings(args, ctx.user) }
    @UseGuards(AuthGuard)
    @UseInterceptors(LogoutInterceptor)
    @Mutation(() => Boolean)
    async logout(@Context('req') ctx: Req & { user: User }): Promise<true> { return this.logoutService.logout(ctx) }
    @Mutation(() => String)
    async forget(@Args(ForgetPipe) args: Forget): Promise<string> { return this.forgetService.forget(args) }
    @Mutation(() => Boolean)
    async validate(@Args() args: Validate): Promise<boolean> { return this.validateService.validate(args) }
    @Mutation(() => Boolean)
    async reset(
        @Args(ResetPipe) args: Reset,
        @Context('res') ctx: { res: Res }
    ): Promise<boolean> { return this.resetService.reset(args, ctx.res) }
    @UseGuards(AuthGuard)
    @UseInterceptors(LogoutInterceptor)
    @Mutation(() => Boolean)
    async terminate(@Context('req') ctx: Req & { user: User }): Promise<true> { return this.terminateService.terminate(ctx) }
}