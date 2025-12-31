import { Injectable, type OnModuleInit } from '@nestjs/common'
import { PrismaService } from '@infrastructure/database/prisma.service.js'
import { RedisService } from './redis.service.js'
import { CacheService } from './cache.service.js'
import { SecurityService } from '@shared/utils/services/security.service.js'
import { FormatterService } from '@shared/utils/services/formatter.service.js'

@Injectable()
export class SubscriberService implements OnModuleInit {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly redisService: RedisService,
        private readonly cacheService: CacheService,
        private readonly securityService: SecurityService,
        private readonly formatterService: FormatterService
    ) {}
    async onModuleInit() {
        await this.redisService.sub.subscribe(
            'collection:update',
            async (user_id) => {
                const key = this.securityService.sanitizeRedisKey('collection', user_id)
                const keysToDelete = `${key}|*`
                const updatedBooks = await this.prismaService.collection.findMany({ where: { user_id } })
                await this.redisService.redis.json.SET(key, '$', this.formatterService.formatBooksMap(updatedBooks))
                await this.redisService.redis.EXPIRE(key, 86400, 'NX')
                await this.cacheService.scanAndDelete(keysToDelete)
            }
        )
    }
}