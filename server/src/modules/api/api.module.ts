import { Module } from '@nestjs/common'
import { UtilModule } from '@shared/utils/util.module.js'
import { ApiResolver } from './api.resolver.js'
import { CheckService } from './services/check.service.js'
import { GenerateService } from './services/generate.service.js'

@Module({
    imports: [UtilModule],
    providers: [ApiResolver, CheckService, GenerateService],
})
export class ApiModule {}