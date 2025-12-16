import { Injectable } from '@nestjs/common'
import { RedisService } from '@infrastructure/cache/services/redis.service.js'
import type { User } from '@type/user.d.ts'

@Injectable()
export class LogoutService {
    constructor(private readonly redisService: RedisService) { }
    async logout(ctx: ReqRes & { user: User }): Promise<boolean> {
        const { req, res, user } = ctx
        let key: string[] = []
        const sources: Record<string, string | null | undefined> = {
            access: req.headers.authorization?.startsWith('Bearer ')
                ? req.headers.authorization.split(' ')[1]
                : null,
            refresh: req.cookies['!'] ?? null,
            user: user.id
        }
        for (const source in sources) {

        }
        await this.redisService.redis.DEL(key)
        return true
    }
}