import { Module } from '@nestjs/common'
import { SecurityModule } from '@shared/utils/security/security.module.js'
import { FormatterModule } from '@shared/utils/formatter/formatter.module.js'
import { MiscModule } from '@shared/utils/misc/misc.module.js'
import { AccountModule } from '@shared/account/account.module.js'
import { RegisterPipe } from '@common/pipes/auth/register.pipe.js'
import { AuthResolver } from './auth.resolver.js'
import { RegisterService } from './services/register.service.js'

@Module({
    imports: [SecurityModule, FormatterModule, MiscModule, AccountModule],
    providers: [RegisterPipe, AuthResolver, RegisterService]
})
export class AuthModule {}