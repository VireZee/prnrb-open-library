import { Injectable, Res } from '@nestjs/common'
import { RedisService } from '@database/services/redis.service.js'
import { SecurityService } from '@shared/utils/security/services/security.service.js'
import { EmailService } from '@shared/email/email.service.js'

@Injectable()
export class AccountService {
    constructor(
        private readonly redisService: RedisService,
        private readonly securityService: SecurityService,
        private readonly emailService: EmailService
    ) { }
    async generateCode(keyName: string, user: { id: string, email: string }, isForget: boolean): Promise<void> {
        const key = this.securityService.sanitizeService.sanitizeRedisKey(keyName, user.id)
        const randomString = nodeCrypto.randomBytes(64).toString('hex')
        const verificationCode = nodeCrypto.createHash('sha512').update(randomString).digest('hex')
        await this.redisService.redis.HSET(key, 'code', verificationCode)
        await this.redisService.redis.HEXPIRE(key, 'code', 300)
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