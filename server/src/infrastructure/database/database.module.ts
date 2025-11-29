import { Global, Module } from '@nestjs/common'
import { SecurityModule } from '@shared/utils/security/security.module.js'
import { FormatterModule } from '@shared/utils/formatter/formatter.module.js'
import { PrismaService } from './services/prisma.service.js'
import { RedisService } from './services/redis.service.js'
import { CacheService } from './services/cache.service.js'

@Global()
@Module({
    imports: [SecurityModule, FormatterModule],
    providers: [PrismaService, RedisService, CacheService],
    exports: [PrismaService, RedisService, CacheService]
})
export class DatabaseModule {}