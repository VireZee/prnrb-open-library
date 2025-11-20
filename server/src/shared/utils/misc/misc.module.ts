import { Module } from '@nestjs/common'
import { DatabaseModule } from '@database/database.module.js'
import { FormatterModule } from '../formatter/formatter.module.js'
import { MiscService } from './misc.service.js'

@Module({
    imports: [DatabaseModule, FormatterModule],
    providers: [MiscService],
    exports: [MiscService]
})
export class MiscModule {}