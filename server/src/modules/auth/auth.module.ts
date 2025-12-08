import { Module } from '@nestjs/common'
import { UtilModule } from '@shared/utils/util.module.js'
import { RegisterPipe } from '@common/pipes/auth/register.pipe.js'
import { AuthResolver } from './auth.resolver.js'
import { RegisterService } from './services/register.service.js'
import { VerifyService } from './services/verify.service.js'
import { ResendService } from './services/resend.service.js'
import { LoginService } from './services/login.service.js'

@Module({
    imports: [UtilModule],
    providers: [RegisterPipe, AuthResolver, RegisterService, VerifyService, ResendService, LoginService]
})
export class AuthModule {}