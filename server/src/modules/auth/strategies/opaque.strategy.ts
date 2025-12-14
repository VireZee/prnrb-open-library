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
    private async user(id: string): Promise<unknown> {
        const key = this.securityService.sanitizeRedisKey('user', id)
        const cache = await this.redisService.redis.json.GET(key)
        if (cache) return cache
        const user = await this.prismaService.user.findUnique({ where: { id } })
        if (!user) return null
        await this.redisService.redis.json.SET(key, '$', this.formatterService.formatUser(user))
        await this.redisService.redis.EXPIRE(key, 86400)
        return this.formatterService.formatUser(user)
    }
    async validate(req: Req): Promise<unknown> {
        const at = req.headers.authorization
        const rt = req.cookies['!']
        if (!at || !rt) return null
        const key = this.securityService.sanitizeRedisKey('session', rt)
        const [_, token] = at.split(' ')
        const session = await this.redisService.redis.HGETALL(key)
        if (session['at'] === token) return this.user(session['id']!)
        const ua = req.headers['user-agent'] ?? ''
        const lang = req.headers['accept-language'] ?? ''
        const encoding = req.headers['accept-encoding'] ?? ''
        const secChUa = req.headers['sec-ch-ua'] ?? ''
        const secChUaPlatform = req.headers['sec-ch-ua-platform'] ?? ''
        const { platform = '', tz = '', screenRes = '', colorDepth = '', devicePixelRatio = '', touchSupport = '', hardwareConcurrency = '' } = req.body.identity
        const fingerprint = nodeCrypto.createHash('sha256').update(
            ua +
            lang +
            encoding +
            secChUa +
            secChUaPlatform +
            platform +
            tz +
            screenRes +
            colorDepth +
            devicePixelRatio +
            touchSupport +
            hardwareConcurrency
        ).digest('hex')
        if (fingerprint !== session['fingerprint']) return null
        return this.user(session['id']!)
    }
}