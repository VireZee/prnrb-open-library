import { Injectable } from '@nestjs/common'
import { RedisService } from '@infrastructure/redis/services/redis.service.js'
import { RetryService } from '@common/workers/services/retry.service.js'
import { SecurityService } from '@shared/utils/services/security.service.js'
import { FormatterService } from '@shared/utils/services/formatter.service.js'
import ERROR from '@common/constants/error.constant.js'

@Injectable()
export class RateLimiterService {
    constructor(
        private readonly redisService: RedisService,
        private readonly retryService: RetryService,
        private readonly securityService: SecurityService,
        private readonly formatService: FormatterService
    ) {}
    async rateLimiter(keyName: string, id: string, minutes: number, otherKeyName = keyName): Promise<void> {
        const key = this.securityService.sanitizeRedisKey(keyName, id)
        const otherKey = this.securityService.sanitizeRedisKey(otherKeyName, id)
        const increment = await this.redisService.redis.HINCRBY(key, 'attempts', 1)
        if (increment % 3 === 0) {
            const blockDuration = 60 * minutes * (2 ** ((increment / 3) - 1))
            const tx = this.redisService.redis.multi()
            tx.HDEL(otherKey, 'code')
            tx.HSET(key, 'block', '')
            tx.HEXPIRE(key, 'block', blockDuration)
            await tx.EXEC()
            const timeLeft = this.formatService.formatTimeLeft(blockDuration)
            throw { message: `Too many attempts! Try again in ${timeLeft}!`, code: ERROR.RATE_LIMITED }
        }
    }
    async checkBlock(keyName: string, id: string, message: string): Promise<void> {
        const key = this.securityService.sanitizeRedisKey(keyName, id)
        const block = await this.retryService.retry(() => this.redisService.redis.HEXISTS(key, 'block'), {})
        if (block) {
            const blockTTL = await this.retryService.retry(() => this.redisService.redis.HTTL(key, 'block'), {})
            const timeLeft = this.formatService.formatTimeLeft(blockTTL![0]!)
            throw { message: `${message} ${timeLeft}!`, code: ERROR.RATE_LIMITED }
        }
    }
}