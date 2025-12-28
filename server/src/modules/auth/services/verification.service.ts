import { Injectable } from '@nestjs/common'
import { RedisService } from '@infrastructure/cache/services/redis.service.js'
import { SecurityService } from '@shared/utils/services/security.service.js'
import { EmailService } from '@infrastructure/email/email.service.js'
import type Identity from '@type/auth/identity.d.ts'

@Injectable()
export class VerificationService {
    constructor(
        private readonly redisService: RedisService,
        private readonly securityService: SecurityService,
        private readonly emailService: EmailService
    ) {}
    async generateCode(keyName: string, user: { id: string, email: string }, isForget: boolean): Promise<void> {
        const { id, email } = user
        const key = this.securityService.sanitizeRedisKey(keyName, id)
        const randomString = nodeCrypto.randomBytes(32).toString('hex')
        const verificationCode = nodeCrypto.createHash('sha256').update(randomString).digest('hex')
        await this.redisService.redis.HSET(key, 'code', verificationCode)
        await this.redisService.redis.HEXPIRE(key, 'code', 60 * 5)
        if (isForget) return await this.emailService.resetPassword(email, verificationCode, id)
        return await this.emailService.verifyEmail(email, verificationCode, id)
    }
    async generateToken(req: Req, res: Res, identity: Identity, id: string): Promise<string> {
        const rt = nodeCrypto.randomBytes(32).toString('base64url')
        const refreshKey = `refresh:${rt}`
        const ua = req.headers['user-agent'] ?? ''
        const lang = req.headers['accept-language'] ?? ''
        const encoding = req.headers['accept-encoding'] ?? ''
        const secChUa = req.headers['sec-ch-ua'] ?? ''
        const secChUaPlatform = req.headers['sec-ch-ua-platform'] ?? ''
        const tz = identity.tz ?? ''
        const screenRes = identity.screenRes ?? ''
        const colorDepth = identity.colorDepth ?? ''
        const devicePixelRatio = identity.devicePixelRatio ?? ''
        const touchSupport = identity.touchSupport ?? ''
        const hardwareConcurrency = identity.hardwareConcurrency ?? ''
        const fingerprint = nodeCrypto.createHash('sha256').update(
            ua +
            lang +
            encoding +
            secChUa +
            secChUaPlatform +
            tz +
            screenRes +
            colorDepth +
            devicePixelRatio +
            touchSupport +
            hardwareConcurrency
        ).digest('hex')
        await this.redisService.redis.HSET(refreshKey, {
            id,
            fingerprint
        })
        await this.redisService.redis.EXPIRE(refreshKey, 60 * 60 * 24 * 30)
        const at = nodeCrypto.randomBytes(32).toString('base64url')
        const accessKey = `access:${rt}`
        await this.redisService.redis.SET(accessKey, id, { expiration: { type: 'EX', value: 60 * 5 } })
        res.cookie('!', rt, {
            path: '/',
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            priority: 'high'
        })
        return at
    }
}