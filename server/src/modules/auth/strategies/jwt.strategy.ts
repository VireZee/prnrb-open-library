import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import type { PrismaService } from '@database/prisma.service.js'
import { RedisService } from '@shared/redis/redis.service.js'
import type { SanitizeService } from '@shared/utils/security/sanitize/sanitize.service.js'
import type { FormatterService } from '@shared/utils/formatter/formatter.service.js'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly redisService: RedisService,
        private readonly sanitizeService: SanitizeService,
        private readonly formatterService: FormatterService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([req => req.cookies['!']]),
            secretOrKey: process.env['SECRET_KEY']!
        })
    }
    async validate(payload: { id: string }): Promise<unknown> {
        const { id } = payload
        const key = this.sanitizeService.sanitizeRedisKey('user', id)
        const cache = await this.redisService.redis.json.GET(key)
        if (cache) return cache
        const user = await this.prismaService.user.findUnique({ where: { id } })
        if (!user) return null
        await this.redisService.redis.json.SET(key, '$', this.formatterService.formatUser(user))
        await this.redisService.redis.EXPIRE(key, 86400)
        return this.formatterService.formatUser(user)
    }
}