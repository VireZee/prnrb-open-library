import { Global, Module } from '@nestjs/common'
import { PrismaService } from './services/prisma.service.js'
import { RedisService } from './services/redis.service.js'
import { CacheService } from './services/cache.service.js'

@Global()
@Module({
    providers: [PrismaService, RedisService, CacheService],
    exports: [PrismaService, RedisService, CacheService]
})
export class DatabaseModule {}