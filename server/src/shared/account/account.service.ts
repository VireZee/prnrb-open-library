import { Injectable, Res } from '@nestjs/common'
import { RedisService } from '@infrastructure/database/services/redis.service.js'
import { SecurityService } from '@shared/utils/security/services/security.service.js'
import { EmailService } from '@shared/email/email.service.js'
import { PrismaService } from '@infrastructure/database/services/prisma.service.js'
import type { FormatterService } from '@shared/utils/formatter/formatter.service.js'

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
            sameSite: "strict",
            priority: "high"
        })
    }
    async setToVerified(id: string) {
        const userKey = this.securityService.sanitizeService.sanitizeRedisKey('user', id)
        const verifyKey = this.securityService.sanitizeService.sanitizeRedisKey('verify', id)
        const resendKey = this.securityService.sanitizeService.sanitizeRedisKey('resend', id)
        const user = await this.prismaService.user.update({
            where: { id },
            data: { verified: true }
        })
        await this.redisService.redis.json.SET(userKey, '$.verified', user.verified)
        await this.redisService.redis.DEL([verifyKey, resendKey])
    }
    async rateLimiter(keyName: string, user: { id: string }, minutes: number, otherKeyName = keyName) {
        const key = this.securityService.sanitizeService.sanitizeRedisKey(keyName, user.id)
        const otherKey = this.securityService.sanitizeService.sanitizeRedisKey(otherKeyName, user.id)
        const increment = await this.redisService.redis.HINCRBY(key, 'attempts', 1)
        if (increment % 3 === 0) {
            await this.redisService.redis.HDEL(otherKey, 'code')
            await this.redisService.redis.HSET(key, 'block', '')
            const blockDuration = 60 * minutes * (2 ** ((increment / 3) - 1))
            this.redisService.redis.HEXPIRE(key, 'block', blockDuration)
            const timeLeft = this.formatService.formatTimeLeft(blockDuration)
            throw { code: 'RATE_LIMITED', errors: `Too many attempts! Try again in ${timeLeft}!` }
        }
    }
    async checkBlock(keyName: string, user: { id: string }, message: string) {
        const key = this.securityService.sanitizeService.sanitizeRedisKey(keyName, user.id)
        const block = await this.redisService.redis.HEXISTS(key, 'block')
        if (block) {
            const blockTTL = await this.redisService.redis.HTTL(key, 'block')
            const timeLeft = this.formatService.formatTimeLeft(blockTTL![0]!)
            throw { code: 'RATE_LIMITED', errors: `${message} ${timeLeft}!` }
        }
    }
}