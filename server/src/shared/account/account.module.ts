import { Module } from '@nestjs/common'
import { SecurityModule } from '@shared/utils/security/security.module.js'
import { EmailModule } from '@infrastructure/email/email.module.js'
import { FormatterModule } from '@shared/utils/formatter/formatter.module.js'
import { AccountService } from './account.service.js'

@Module({
    imports: [SecurityModule, EmailModule, FormatterModule],
    providers: [AccountService],
    exports: [AccountService]
})
export class AccountModule {}