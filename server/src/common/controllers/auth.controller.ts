import { Controller, HttpException, HttpStatus, Post, Req, Res } from '@nestjs/common'
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
    async _(
        @Req() req: Req,
        @Res({ passthrough: true }) res: Res
    ): Promise<string | never> {
        const rt = req.cookies['!']
        const at = nodeCrypto.randomBytes(32).toString('base64url')
        if (!rt) throw new HttpException(ERROR.UNAUTHENTICATED, HttpStatus.UNAUTHORIZED)
        const refreshKey = this.securityService.sanitizeRedisKey('refresh', rt)
        const ua = req.headers['user-agent'] ?? ''
        const { tz = '', screenRes = '', colorDepth = '', devicePixelRatio = '', touchSupport = '', hardwareConcurrency = '' } = req.body.identity
        const fingerprint = nodeCrypto.createHash('sha256').update(JSON.stringify({
            ua,
            tz,
            screenRes,
            colorDepth,
            devicePixelRatio,
            touchSupport,
            hardwareConcurrency
        })).digest('hex')
        const session = await this.redisService.redis.HGETALL(refreshKey)
        if (fingerprint !== session['fingerprint']) throw new HttpException(ERROR.UNAUTHENTICATED, HttpStatus.UNAUTHORIZED)
        const newRt = nodeCrypto.randomBytes(32).toString('base64url')
        const newRefreshKey = `refresh:${newRt}`
        await this.redisService.redis.HSET(newRefreshKey, {
            id: session['id']!,
            at,
            fingerprint
        })
        const ttl = await this.redisService.redis.TTL(refreshKey)
        if (ttl <= 0) throw new HttpException(ERROR.UNAUTHENTICATED, HttpStatus.UNAUTHORIZED)
        await this.redisService.redis.EXPIRE(newRefreshKey, ttl)
        const accessKey = `access:${session['at']}`
        await this.redisService.redis.DEL([accessKey, refreshKey])
        const newAccessKey = `access:${at}`
        await this.redisService.redis.SET(newAccessKey, session['id']!, { expiration: { type: 'EX', value: 60 * 5 } })
        res.cookie('!', newRt, {
            path: '/',
            maxAge: 1000 * ttl,
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            priority: 'high'
        })
        return at
    }
}