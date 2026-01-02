import { Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/database/prisma.service.js'
import { RedisService } from '@infrastructure/cache/services/redis.service.js'
import { CacheService } from '@infrastructure/cache/services/cache.service.js'
import { SecurityService } from '@shared/utils/services/security.service.js'
import type { User } from '@type/auth/user.d.ts'

@Injectable()
export class TerminateService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly redisService: RedisService,
        private readonly cacheService: CacheService,
        private readonly securityService: SecurityService
    ) {}
    async terminate(req: Req & { user: User }): Promise<true> {
        const { user } = req
        let key: string[] = []
        const sources: Record<string, string | null | undefined> = {
            access: req.headers.authorization?.startsWith('Bearer ')
                ? req.headers.authorization.split(' ')[1]
                : null,
            refresh: req.cookies['!'] ?? null,
            user: `*${this.securityService.sanitize(user.id)}*`
        }
        for (const source in sources) {
            const value = sources[source]
            if (!value) continue
            if (source === 'user') {
                const pattern = `*${this.securityService.sanitize(value)}*`
                await this.cacheService.scanAndDelete(pattern)
            } else { key.push(this.securityService.sanitizeRedisKey(source, value)) }
        }
        await this.prismaService.collection.deleteMany({ where: { user_id: user.id } })
        await this.prismaService.user.delete({ where: { id: user.id } })
        if (key.length) await this.redisService.redis.DEL(key)
        return true
    }
}