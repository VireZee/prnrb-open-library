import { Injectable } from '@nestjs/common'
import { RedisService } from '@infrastructure/cache/services/redis.service.js'
import { SecurityService } from '@shared/utils/security/services/security.service.js'
import type { Verify } from '../dto/verify.dto.js'
import type { User } from '@type/user.js'
import { AccountService } from '@shared/account/account.service.js'
import ERROR from '@common/constants/error.constant.js'

@Injectable()
export class VerifyService {
    constructor(
        private readonly redisService: RedisService,
        private readonly securityService: SecurityService,
        private readonly accountService: AccountService
    ) { }
    async verify(args: Verify, user: User) {
        const { code } = args
        const key = this.securityService.sanitizeService.sanitizeRedisKey('verify', user.id)
        const getVerify = await this.redisService.redis.HGETALL(key)
        if (user.verified) throw { code: ERROR.ALREADY_VERIFIED }
        if (!getVerify['code']) throw { code: ERROR.VERIFICATION_CODE_EXPIRED }
        await this.accountService.checkBlock('verify', user, 'You have been temporarily blocked from verifying your code due to too many failed attempts! Try again in')
        if (code !== getVerify['code']) {
            await this.accountService.rateLimiter('verify', user, 60)
            throw { code: ERROR.INVALID_VERIFICATION_CODE }
        }
        await this.accountService.setToVerified(user.id)
        return true
    }
}