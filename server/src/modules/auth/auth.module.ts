import { Module } from '@nestjs/common'
import { SecurityModule } from '@shared/utils/security/security.module.js'
import { FormatterModule } from '@shared/utils/formatter/formatter.module.js'
import { MiscModule } from '@shared/utils/misc/misc.module.js'
import { AccountModule } from '@shared/account/account.module.js'
import { RegisterPipe } from '@common/pipes/auth/register.pipe.js'
import { AuthResolver } from './auth.resolver.js'
import { RegisterService } from './services/register.service.js'
import { VerifyService } from './services/verify.service.js'
import { ResendService } from './services/resend.service.js'
import { LoginService } from './services/login.service.js'
import { ValidationModule } from '@shared/utils/validation/validation.module.js'

@Module({
    imports: [SecurityModule, ValidationModule, FormatterModule, MiscModule, AccountModule],
    providers: [RegisterPipe, AuthResolver, RegisterService, VerifyService, ResendService, LoginService]
})
export class AuthModule { }