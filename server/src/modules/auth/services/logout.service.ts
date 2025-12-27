import { Injectable } from '@nestjs/common'
import { RedisService } from '@infrastructure/cache/services/redis.service.js'
import { SecurityService } from '@shared/utils/services/security.service.js'
import type { User } from '@type/auth/user.d.ts'

@Injectable()
export class LogoutService {
    constructor(
        private readonly redisService: RedisService,
        private readonly securityService: SecurityService
    ) {}
    async logout(ctx: { req: Req, user: User }): Promise<true> {
        const { req, user } = ctx
        let key: string[] = []
        const sources: Record<string, string | null | undefined> = {
            access: req.headers.authorization?.startsWith('Bearer ')
                ? req.headers.authorization.split(' ')[1]
                : null,
            refresh: req.cookies['!'] ?? null,
            user: user.id
        }
        for (const source in sources) {
            const value = sources[source]
            if (!value) continue
            key.push(this.securityService.sanitizeRedisKey(source, value))
        }
        if (key.length) await this.redisService.redis.DEL(key)
        return true
    }
}