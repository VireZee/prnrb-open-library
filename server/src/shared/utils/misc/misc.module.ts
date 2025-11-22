import { Module } from '@nestjs/common'
import { FormatterModule } from '../formatter/formatter.module.js'
import { MiscService } from './misc.service.js'

@Module({
    imports: [FormatterModule],
    providers: [MiscService],
    exports: [MiscService]
})
export class MiscModule {}