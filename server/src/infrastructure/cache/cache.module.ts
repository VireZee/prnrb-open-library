import { Global, Module } from '@nestjs/common'
import { UtilModule } from '@shared/utils/util.module.js'
import { RedisService } from './services/redis.service.js'
import { PublisherService } from './services/publisher.service.js'
import { SubscriberService } from './services/subscriber.service.js'
import { CacheService } from './services/cache.service.js'

@Global()
@Module({
    imports: [UtilModule],
    providers: [RedisService, PublisherService, SubscriberService, CacheService],
    exports: [RedisService, PublisherService, SubscriberService, CacheService]
})
export class CacheModule {}