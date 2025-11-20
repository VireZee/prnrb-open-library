import { Module } from '@nestjs/common'
import { AuthResolver } from './auth.resolver.js'
import { RegisterPipe } from '@common/pipes/register.pipe.js'
import { RegisterService } from './services/register.service.js'
import { ValidationModule } from '@shared/utils/validation/validation.module.js'
import { FormatterModule } from '@shared/utils/formatter/formatter.module.js'
import { MiscModule } from '@shared/utils/misc/misc.module.js'
import { SecurityModule } from '@shared/utils/security/security.module.js'

@Module({
    imports: [ValidationModule, FormatterModule, MiscModule, SecurityModule],
    providers: [
        RegisterPipe,
        AuthResolver,
        RegisterService
    ]
})
export class AuthModule {}