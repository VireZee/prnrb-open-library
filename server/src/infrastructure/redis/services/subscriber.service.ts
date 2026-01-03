import { Injectable, type OnModuleInit } from '@nestjs/common'
import { PrismaService } from '@infrastructure/database/prisma.service.js'
import { RedisService } from './redis.service.js'
import { CacheService } from './cache.service.js'
import { RetryService } from '@common/workers/services/retry.service.js'
import { SecurityService } from '@shared/utils/services/security.service.js'
import { FormatterService } from '@shared/utils/services/formatter.service.js'

@Injectable()
export class SubscriberService implements OnModuleInit {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly redisService: RedisService,
        private readonly cacheService: CacheService,
        private readonly retryService: RetryService,
        private readonly securityService: SecurityService,
        private readonly formatterService: FormatterService
    ) {}
    async onModuleInit(): Promise<void> {
        await this.redisService.sub.subscribe('user:update', async (message) => {
            try {
                const { id, update } = JSON.parse(message)
                const key = this.securityService.sanitizeRedisKey('user', id)
                if (update.photo) await this.retryService.retry(() => this.redisService.redis.json.SET(key, '$.photo', update.photo), {})
                if (update.name) await this.retryService.retry(() => this.redisService.redis.json.SET(key, '$.name', update.name), {})
                if (update.username) await this.retryService.retry(() => this.redisService.redis.json.SET(key, '$.username', update.username), {})
                if (update.email) await this.retryService.retry(() => this.redisService.redis.json.SET(key, '$.email', update.email), {})
            } catch {}
        })
        await this.redisService.sub.subscribe('collection:update', async (user_id) => {
            try {
                const key = this.securityService.sanitizeRedisKey('collection', user_id)
                const keysToDelete = `${key}|*`
                const updatedBooks = await this.prismaService.collection.findMany({ where: { user_id } })
                await this.retryService.retry(() => this.redisService.redis.json.SET(key, '$', this.formatterService.formatBooksMap(updatedBooks)), {})
                await this.retryService.retry(() => this.redisService.redis.EXPIRE(key, 86400, 'NX'), {})
                await this.cacheService.scanAndDelete(keysToDelete)
            } catch {}
        })
    }
}