import { Module } from '@nestjs/common'
import { AuthController } from '@common/controllers/auth.controller.js'
import { UtilModule } from '@shared/utils/util.module.js'
import { RegisterInterceptor } from '@common/interceptors/auth/register.interceptor.js'
import { LoginInterceptor } from '@common/interceptors/auth/login.interceptor.js'
import { SettingsInterceptor } from '@common/interceptors/auth/settings.interceptor.js'
import { RegisterPipe } from '@common/pipes/auth/register.pipe.js'
import { LoginPipe } from '@common/pipes/auth/login.pipe.js'
import { SettingsPipe } from '@common/pipes/auth/settings.pipe.js'
import { AuthResolver } from './auth.resolver.js'
import { VerificationService } from './services/verification.service.js'
import { RateLimiterService } from './services/rate-limiter.service.js'
import { RegisterService } from './services/register.service.js'
import { VerifyService } from './services/verify.service.js'
import { ResendService } from './services/resend.service.js'
import { LoginService } from './services/login.service.js'
import { SettingService } from './services/settings.service.js'

@Module({
    controllers: [AuthController],
    imports: [UtilModule],
    providers: [
        RegisterInterceptor,
        LoginInterceptor,
        SettingsInterceptor,
        RegisterPipe,
        LoginPipe,
        SettingsPipe,
        AuthResolver,
        VerificationService,
        RateLimiterService,
        RegisterService,
        VerifyService,
        ResendService,
        LoginService,
        SettingService
    ]
})
export class AuthModule {}