import { Injectable, Res } from '@nestjs/common'
import { RedisService } from '@shared/redis/redis.service.js'
import type { SecurityService } from '@shared/utils/security/security.service.js'
import type { EmailService } from './email/email.service.js'

@Injectable()
export class AccountService extends RedisService {
    constructor(
        private readonly securityService: SecurityService,
        private readonly emailService: EmailService
    ) { super() }
    async generateCode(keyName: string, user: { id: string, email: string }, isForget: boolean) {
        const key = this.securityService.sanitizeService.sanitizeRedisKey(keyName, user.id)
        const randomString = nodeCrypto.randomBytes(64).toString('hex')
        const verificationCode = nodeCrypto.createHash('sha512').update(randomString).digest('hex')
        await this.redis().HSET(key, 'code', verificationCode)
        await this.redis().HEXPIRE(key, 'code', 300)
        if (isForget) return await this.emailService.resetPassword(user.email, verificationCode, user.id)
        return await this.emailService.verifyEmail(user.email, verificationCode, user.id)
    }
    cookie(user: { id: string }, @Res({ passthrough: true }) res: Res): void {
        const token = this.securityService.jwtSign(user.id)
        res.cookie('!', token, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            priority: "high"
        })
    }
    setToVerified() { }
    rateLimiter() { }
    checkBlock() { }
}