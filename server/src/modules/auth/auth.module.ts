import { Module } from '@nestjs/common'
import { UtilModule } from '@shared/utils/util.module.js'
import { RegisterPipe } from '@common/pipes/auth/register.pipe.js'
import { AuthResolver } from './auth.resolver.js'
import { VerificationService } from './services/verification.service.js'
import { RateLimiterService } from './services/rate-limiter.service.js'
import { RegisterService } from './services/register.service.js'
import { VerifyService } from './services/verify.service.js'
import { ResendService } from './services/resend.service.js'
import { LoginService } from './services/login.service.js'

@Module({
    imports: [UtilModule],
    providers: [RegisterPipe, AuthResolver, VerificationService, RateLimiterService, RegisterService, VerifyService, ResendService, LoginService]
})
export class AuthModule {}