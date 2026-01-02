import { Injectable } from '@nestjs/common'
import { RedisService } from '@infrastructure/redis/services/redis.service.js'
import { SecurityService } from '@shared/utils/services/security.service.js'
import type { User } from '@type/auth/user.d.ts'

@Injectable()
export class CheckService {
    constructor(
        private readonly redisService: RedisService,
        private readonly securityService: SecurityService
    ) {}
    async check(user: User): Promise<string | null> {
        const key = this.securityService.sanitizeRedisKey('user', user.id)
        const rawCache = await this.redisService.redis.json.GET(key)
        const cache = rawCache as User | null
        if (cache) return cache.api_key ?? null
        return user.api_key ?? null
    }
}