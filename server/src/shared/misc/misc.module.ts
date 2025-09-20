import { Module } from '@nestjs/common'
import { GenerateSvgService } from './generate-svg.service.js'

@Module({
    providers: [GenerateSvgService],
    exports: [GenerateSvgService]
})
export class MiscModule {}