import { Controller, Post, Req, Res } from '@nestjs/common'
import { RedisService } from '@infrastructure/cache/services/redis.service.js'
import { SecurityService } from '@shared/utils/services/security.service.js'
import ERROR from '../constants/error.constant.js'

@Controller('auth')
export class AuthController {
    constructor(
        private readonly redisService: RedisService,
        private readonly securityService: SecurityService
    ) {}
    @Post()
    async auth(@Req() req: Req, @Res({ passthrough: true }) res: Res) {
        const rt = req.cookies['!']
        if (!rt) throw { code: ERROR.UNAUTHENTICATED }
        const refreshKey = this.securityService.sanitizeRedisKey('refresh', rt)
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
        const session = await this.redisService.redis.HGETALL(refreshKey)
        if (fingerprint !== session['fingerprint']) throw { code: ERROR.UNAUTHENTICATED }
        const newRt = nodeCrypto.randomBytes(32).toString('base64url')
        const newRefreshKey = `refresh:${newRt}`
        await this.redisService.redis.HSET(newRefreshKey, {
            id: session['id']!,
            fingerprint
        })
        const ttl = await this.redisService.redis.TTL(refreshKey)
        if (ttl <= 0) throw { code: ERROR.UNAUTHENTICATED }
        await this.redisService.redis.EXPIRE(newRefreshKey, ttl)
        await this.redisService.redis.DEL(refreshKey)
        const at = nodeCrypto.randomBytes(32).toString('base64url')
        const accessKey = `access:${at}`
        await this.redisService.redis.SET(accessKey, session['id']!, { expiration: { type: 'EX', value: 60 * 5 } })
        res.cookie('!', newRt, {
            path: '/auth',
            maxAge: 1000 * ttl,
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            priority: 'high'
        })
        return at
    }
}