import { Module } from '@nestjs/common'
import { DatabaseModule } from '@database/database.module.js'
import { FormatterModule } from '../formatter/formatter.module.js'
import { ValidationService } from './validation.service.js'

@Module({
    imports: [DatabaseModule, FormatterModule],
    providers: [ValidationService],
    exports: [ValidationService]
})
export class ValidationModule {}