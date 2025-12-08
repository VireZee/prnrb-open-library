import { Injectable, Res } from '@nestjs/common'
import { RedisService } from '@infrastructure/cache/services/redis.service.js'
import { SecurityService } from '@shared/utils/services/security.service.js'
import { EmailService } from '@infrastructure/email/email.service.js'
import { PrismaService } from '@infrastructure/database/prisma.service.js'
import { FormatterService } from '@shared/utils/services/formatter.service.js'

@Injectable()
export class AccountService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly redisService: RedisService,
        private readonly securityService: SecurityService,
        private readonly emailService: EmailService,
        private readonly formatService: FormatterService
    ) { }
    async generateCode(keyName: string, user: { id: string, email: string }, isForget: boolean): Promise<void> {
        const key = this.securityService.sanitizeRedisKey(keyName, user.id)
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
            sameSite: "strict",
            priority: "high"
        })
    }
}