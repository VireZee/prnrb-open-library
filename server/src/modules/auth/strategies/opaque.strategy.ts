import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-custom'
import { RedisService } from '@infrastructure/cache/services/redis.service.js'
import { SecurityService } from '@shared/utils/services/security.service.js'
import { FormatterService } from '@shared/utils/services/formatter.service.js'

@Injectable()
export class OpaqueStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly redisService: RedisService,
        private readonly securityService: SecurityService,
        private readonly formatterService: FormatterService
    ) { super() }
    async validate(req: Req): Promise<unknown> {
        const token = req.cookies['!']
        if (!token) return null
        const session = await this.redisService.redis.HGETALL(`session:${token}`)
        if (!session) return null
        const ua = req.headers['user-agent'] ?? ''
        const lang = req.headers['accept-language'] ?? ''
        const encoding = req.headers['accept-encoding'] ?? ''
        const secChUa = req.headers['sec-ch-ua'] ?? ''
        const secChUaPlatform = req.headers['sec-ch-ua-platform'] ?? ''
        const identity = {
            platform: session['platform'] ?? '',
            tz: session['tz'] ?? '',
            screenRes: session['screenRes'] ?? '',
            colorDepth: session['colorDepth'] ?? '',
            devicePixelRatio: session['devicePixelRatio'] ?? '',
            touchSupport: session['touchSupport'] ?? '',
            hardwareConcurrency: session['hardwareConcurrency'] ?? ''
        }
        const fingerprint = nodeCrypto.createHash('sha256').update(
            ua +
            lang +
            encoding +
            secChUa +
            secChUaPlatform +
            identity.platform +
            identity.tz +
            identity.screenRes +
            identity.colorDepth +
            identity.devicePixelRatio +
            identity.touchSupport +
            identity.hardwareConcurrency
        ).digest('hex')
        if (fingerprint !== session['fingerprint']) return null
        return this.formatterService.formatUser(user)
    }
}