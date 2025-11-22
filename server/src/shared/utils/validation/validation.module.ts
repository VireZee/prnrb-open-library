import { Module } from '@nestjs/common'
import { FormatterModule } from '../formatter/formatter.module.js'
import { ValidationService } from './validation.service.js'

@Module({
    imports: [FormatterModule],
    providers: [ValidationService],
    exports: [ValidationService]
})
export class ValidationModule {}