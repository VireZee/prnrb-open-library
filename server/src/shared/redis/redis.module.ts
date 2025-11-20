import { Module } from '@nestjs/common'
import { RedisService } from './redis.service.js'
import { CacheService } from './cache/cache.service.js'

@Module({
    providers: [RedisService, CacheService],
    exports: [RedisService]
})
export class RedisModule {}