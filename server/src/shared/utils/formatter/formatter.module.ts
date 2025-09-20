import { Module } from '@nestjs/common'
import { FormatterService } from './formatter.service.js'

@Module({
    providers: [FormatterService],
    exports: [FormatterService]
})
export class FormatterModule {}