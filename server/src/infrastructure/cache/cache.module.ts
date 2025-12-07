import { Global, Module } from '@nestjs/common'
import { UtilModule } from '@shared/utils/util.module.js'
import { RedisService } from './services/redis.service.js'
import { CacheService } from './services/cache.service.js'

@Global()
@Module({
    imports: [UtilModule],
    providers: [RedisService, CacheService],
    exports: [RedisService, CacheService]
})
export class CacheModule {}