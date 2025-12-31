import { Module } from '@nestjs/common'
import { AuthController } from '@common/controllers/auth.controller.js'
import { EmailModule } from '@infrastructure/email/email.module.js'
import { UtilModule } from '@shared/utils/util.module.js'
import { OpaqueStrategy } from './strategies/opaque.strategy.js'
import { RegisterInterceptor } from '@common/interceptors/auth/register.interceptor.js'
import { RegisterPipe } from '@common/pipes/auth/register.pipe.js'
import { LoginInterceptor } from '@common/interceptors/auth/login.interceptor.js'
import { LoginPipe } from '@common/pipes/auth/login.pipe.js'
import { SettingsInterceptor } from '@common/interceptors/auth/settings.interceptor.js'
import { SettingsPipe } from '@common/pipes/auth/settings.pipe.js'
import { LogoutInterceptor } from '@common/interceptors/auth/logout.interceptor.js'
import { ForgetPipe } from '@common/pipes/auth/forget.pipe.js'
import { ResetPipe } from '@common/pipes/auth/reset.pipe.js'
import { AuthResolver } from './auth.resolver.js'
import { VerificationService } from './services/verification.service.js'
import { RateLimiterService } from './services/rate-limiter.service.js'
import { RegisterService } from './services/register.service.js'
import { VerifyService } from './services/verify.service.js'
import { ResendService } from './services/resend.service.js'
import { LoginService } from './services/login.service.js'
import { SettingService } from './services/settings.service.js'
import { LogoutService } from './services/logout.service.js'
import { ForgetService } from './services/forget.service.js'
import { ValidateService } from './services/validate.service.js'
import { ResetService } from './services/reset.service.js'
// import { TerminateService } from './services/terminate.service.js'

@Module({
    controllers: [AuthController],
    imports: [EmailModule, UtilModule],
    providers: [
        OpaqueStrategy,
        RegisterInterceptor,
        RegisterPipe,
        LoginInterceptor,
        LoginPipe,
        SettingsInterceptor,
        SettingsPipe,
        LogoutInterceptor,
        ForgetPipe,
        ResetPipe,
        AuthResolver,
        VerificationService,
        RateLimiterService,
        RegisterService,
        VerifyService,
        ResendService,
        LoginService,
        SettingService,
        LogoutService,
        ForgetService,
        ValidateService,
        ResetService,
        // TerminateService
    ]
})
export class AuthModule {}