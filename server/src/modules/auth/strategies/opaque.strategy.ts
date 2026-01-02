import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-custom'
import { PrismaService } from '@infrastructure/database/prisma.service.js'
import { RedisService } from '@infrastructure/redis/services/redis.service.js'
import { SecurityService } from '@shared/utils/services/security.service.js'
import { FormatterService } from '@shared/utils/services/formatter.service.js'
import ERROR from '@common/constants/error.constant.js'

@Injectable()
export class OpaqueStrategy extends PassportStrategy(Strategy, 'opaque') {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly redisService: RedisService,
        private readonly securityService: SecurityService,
        private readonly formatterService: FormatterService
    ) { super() }
    async validate(req: Req): Promise<unknown> {
        const at = req.headers.authorization
        if (!at!.startsWith('Bearer ')) return null
        const token = at!.slice(7)
        if (!token) return null
        const accessKey = this.securityService.sanitizeRedisKey('access', token)
        const session = await this.redisService.redis.GET(accessKey)
        if (!session) throw { code: ERROR.TOKEN_EXPIRED }
        const userKey = this.securityService.sanitizeRedisKey('user', session)
        const cache = await this.redisService.redis.json.GET(userKey)
        if (cache) return cache
        const user = await this.prismaService.user.findUnique({ where: { id: session } })
        if (!user) return null
        await this.redisService.redis.json.SET(userKey, '$', this.formatterService.formatUser(user))
        await this.redisService.redis.EXPIRE(userKey, 60 * 60 * 24 * 30)
        return this.formatterService.formatUser(user)
    }
}