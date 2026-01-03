import { Injectable } from '@nestjs/common'
import { RedisService } from '@infrastructure/redis/services/redis.service.js'
import { EmailService } from '@infrastructure/email/email.service.js'
import { RetryService } from '@common/workers/services/retry.service.js'
import { SecurityService } from '@shared/utils/services/security.service.js'
import type Identity from '@type/auth/identity.d.ts'

@Injectable()
export class VerificationService {
    constructor(
        private readonly redisService: RedisService,
        private readonly emailService: EmailService,
        private readonly retryService: RetryService,
        private readonly securityService: SecurityService
    ) {}
    async generateCode(keyName: string, user: { id: string, email: string }, isForget: boolean): Promise<void> {
        const { id, email } = user
        const key = this.securityService.sanitizeRedisKey(keyName, id)
        const randomString = nodeCrypto.randomBytes(32).toString('hex')
        const verificationCode = nodeCrypto.createHash('sha256').update(randomString).digest('hex')
        await this.retryService.retry(() => this.redisService.redis.HSET(key, 'code', verificationCode), {})
        await this.retryService.retry(() => this.redisService.redis.HEXPIRE(key, 'code', 60 * 5), {})
        if (isForget) return await this.retryService.retry(() => this.emailService.resetPassword(email, verificationCode, id), {})
        return await this.retryService.retry(() => this.emailService.verifyEmail(email, verificationCode, id), {})
    }
    async generateToken(req: Req, res: Res, identity: Identity, id: string): Promise<string> {
        const rt = nodeCrypto.randomBytes(32).toString('base64url')
        const at = nodeCrypto.randomBytes(32).toString('base64url')
        const refreshKey = `refresh:${rt}`
        const ua = req.headers['user-agent'] ?? ''
        const { tz = '', screenRes = '', colorDepth = '', devicePixelRatio = '', touchSupport = '', hardwareConcurrency = '' } = identity
        const fingerprint = nodeCrypto.createHash('sha256').update(JSON.stringify({
            ua,
            tz,
            screenRes,
            colorDepth,
            devicePixelRatio,
            touchSupport,
            hardwareConcurrency
        })).digest('hex')
        await this.redisService.redis.HSET(refreshKey, {
            id,
            at,
            fingerprint
        })
        await this.redisService.redis.EXPIRE(refreshKey, 60 * 60 * 24 * 30)
        const accessKey = `access:${at}`
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