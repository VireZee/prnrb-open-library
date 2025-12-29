import { Injectable } from '@nestjs/common'
import { RedisService } from '@infrastructure/cache/services/redis.service.js'
import { SecurityService } from '@shared/utils/services/security.service.js'
import { FormatterService } from '@shared/utils/services/formatter.service.js'
import ERROR from '@common/constants/error.constant.js'

@Injectable()
export class RateLimiterService {
    constructor(
        private readonly redisService: RedisService,
        private readonly securityService: SecurityService,
        private readonly formatService: FormatterService
    ) {}
    async rateLimiter(keyName: string, id: string, minutes: number, otherKeyName = keyName): Promise<void> {
        const key = this.securityService.sanitizeRedisKey(keyName, id)
        const otherKey = this.securityService.sanitizeRedisKey(otherKeyName, id)
        const increment = await this.redisService.redis.HINCRBY(key, 'attempts', 1)
        if (increment % 3 === 0) {
            await this.redisService.redis.HDEL(otherKey, 'code')
            await this.redisService.redis.HSET(key, 'block', '')
            const blockDuration = 60 * minutes * (2 ** ((increment / 3) - 1))
            this.redisService.redis.HEXPIRE(key, 'block', blockDuration)
            const timeLeft = this.formatService.formatTimeLeft(blockDuration)
            throw { message: `Too many attempts! Try again in ${timeLeft}!`, code: ERROR.RATE_LIMITED }
        }
    }
    async checkBlock(keyName: string, id: string, message: string): Promise<void> {
        const key = this.securityService.sanitizeRedisKey(keyName, id)
        const block = await this.redisService.redis.HEXISTS(key, 'block')
        if (block) {
            const blockTTL = await this.redisService.redis.HTTL(key, 'block')
            const timeLeft = this.formatService.formatTimeLeft(blockTTL![0]!)
            throw { message: `${message} ${timeLeft}!`, code: ERROR.RATE_LIMITED }
        }
    }
}