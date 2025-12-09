import { Injectable } from '@nestjs/common'
import { RedisService } from '@infrastructure/cache/services/redis.service.js'
import { SecurityService } from '@shared/utils/services/security.service.js'
import { EmailService } from '@infrastructure/email/email.service.js'

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
    async cookie(req: Req, res: Res, fp: { platform: string, tz: string, screenRes: string, colorDepth: string, devicePixelRatio: string, touchSupport: string, hardwareConcurrency: string }, id: string): Promise<void> {
        const token = nodeCrypto.randomBytes(32).toString('base64url')
        const ip = (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim().split(':')[0] || req.ip || ''
        const ua = req.headers['user-agent'] ?? ''
        const lang = req.headers['accept-language'] ?? ''
        const encoding = req.headers['accept-encoding'] ?? ''
        const secChUa = req.headers['sec-ch-ua'] ?? ''
        const secChUaPlatform = req.headers['sec-ch-ua-platform'] ?? ''
        const platform = fp.platform ?? ''
        const tz = fp.tz ?? ''
        const screenRes = fp.screenRes ?? ''
        const colorDepth = fp.colorDepth ?? ''
        const devicePixelRatio = fp.devicePixelRatio ?? ''
        const touchSupport = fp.touchSupport ?? ''
        const hardwareConcurrency = fp.hardwareConcurrency ?? ''
        const fingerprint = nodeCrypto.createHash('sha256').update(ua + lang + encoding + secChUa + secChUaPlatform + platform + tz + screenRes + colorDepth + devicePixelRatio + touchSupport + hardwareConcurrency).digest('hex')
        await this.redisService.redis.HSET(`session:${token}`, {
            id,
            ip,
            fingerprint
        })
        await this.redisService.redis.EXPIRE(`session:${token}`, 60 * 60 * 24 * 30)
        res.cookie('!', token, {
            path: '/auth',
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            priority: 'high'
        })
    }
}