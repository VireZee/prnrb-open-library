import { Module } from '@nestjs/common'
import { MiscService } from './misc.service.js'

@Module({
    providers: [MiscService],
    exports: [MiscService]
})
export class MiscModule {}