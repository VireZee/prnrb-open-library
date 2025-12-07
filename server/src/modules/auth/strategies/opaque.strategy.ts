import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-custom'
import { PrismaService } from '@infrastructure/database/prisma.service.js'
import { RedisService } from '@infrastructure/cache/services/redis.service.js'
import { SecurityService } from '@shared/utils/services/security.service.js'
import { FormatterService } from '@shared/utils/services/formatter.service.js'

@Injectable()
export class OpaqueStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly redisService: RedisService,
        private readonly securityService: SecurityService,
        private readonly formatterService: FormatterService
    ) { super() }
    async validate(req: Req): Promise<unknown> {
        const token = req.cookies['!']
        const key = this.securityService.sanitizeService.sanitizeRedisKey('user', id)
        const cache = await this.redisService.redis.json.GET(key)
        if (cache) return cache
        const user = await this.prismaService.user.findUnique({ where: { id } })
        if (!user) return null
        await this.redisService.redis.json.SET(key, '$', this.formatterService.formatUser(user))
        await this.redisService.redis.EXPIRE(key, 86400)
        return this.formatterService.formatUser(user)
    }
}