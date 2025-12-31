import { Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/database/prisma.service.js'
import { RedisService } from '@infrastructure/cache/services/redis.service.js'
import { SecurityService } from '@shared/utils/services/security.service.js'
import { RateLimiterService } from './rate-limiter.service.js'
import type { Verify } from '../dto/verify.dto.js'
import ERROR from '@common/constants/error.constant.js'
import type { User } from '@type/auth/user.d.ts'

@Injectable()
export class VerifyService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly redisService: RedisService,
        private readonly securityService: SecurityService,
        private readonly rateLimiterService: RateLimiterService,
    ) {}
    async setToVerified(id: string): Promise<void> {
        const userKey = this.securityService.sanitizeRedisKey('user', id)
        const verifyKey = this.securityService.sanitizeRedisKey('verify', id)
        const resendKey = this.securityService.sanitizeRedisKey('resend', id)
        const user = await this.prismaService.user.update({
            where: { id },
            data: { verified: true }
        })
        await this.redisService.redis.json.SET(userKey, '$.verified', user.verified)
        await this.redisService.redis.DEL([verifyKey, resendKey])
    }
    async verify(args: Verify, user: User): Promise<true> {
        const { code } = args
        const key = this.securityService.sanitizeRedisKey('verify', user.id)
        const verify = await this.redisService.redis.HGETALL(key)
        if (user.verified) throw { message: 'Already verified!', code: ERROR.ALREADY_VERIFIED }
        if (!verify['code']) throw { message: 'Verification code expired!', code: ERROR.VERIFICATION_CODE_EXPIRED }
        await this.rateLimiterService.checkBlock('verify', user.id, 'You have been temporarily blocked from verifying your code due to too many failed attempts! Try again in')
        if (code !== verify['code']) {
            await this.rateLimiterService.rateLimiter('verify', user.id, 60)
            throw { message: 'Invalid verification code!', code: ERROR.INVALID_VERIFICATION_CODE }
        }
        await this.setToVerified(user.id)
        return true
    }
}