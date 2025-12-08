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
    ) { }
    async generateCode(keyName: string, user: { id: string, email: string }, isForget: boolean): Promise<void> {
        const { id, email } = user
        const key = this.securityService.sanitizeRedisKey(keyName, id)
        const randomString = nodeCrypto.randomBytes(32).toString('hex')
        const verificationCode = nodeCrypto.createHash('sha256').update(randomString).digest('hex')
        await this.redisService.redis.HSET(key, 'code', verificationCode)
        await this.redisService.redis.HEXPIRE(key, 'code', 300)
        if (isForget) return await this.emailService.resetPassword(email, verificationCode, id)
        return await this.emailService.verifyEmail(email, verificationCode, id)
    }
    async cookie(req: Req, res: Res, id: string): Promise<void> {
        const token = nodeCrypto.randomBytes(32).toString('base64url')
        const ua = req.headers['user-agent'] ?? ''
        const ip = (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim().split(':')[0] || req.ip || ''
        const deviceId = nodeCrypto.createHash('sha256').update(ua + ip).digest('hex')
        this.redisService.redis.HSET(`session:${token}`, {
            id,
            ua,
            ip,
            deviceId
        })
        res.cookie('!', token, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            path: '/auth',
            priority: 'high'
        })
    }
}