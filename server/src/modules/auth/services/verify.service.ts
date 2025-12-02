import { Injectable } from '@nestjs/common';
import { RedisService } from '@infrastructure/database/services/redis.service.js'
import { SecurityService } from '@shared/utils/security/services/security.service.js'
import type { Verify } from '../dto/verify.dto.js'
import type { User } from '@type/user.js'

@Injectable()
export class VerifyService {
    constructor(
            private readonly redisService: RedisService,
            private readonly securityService: SecurityService
    ) {}
    async verify(args: Verify, user: User) {
        const { code } = args
        const key = this.securityService.sanitizeService.sanitizeRedisKey('verify', user.id)
        const getVerify = await this.redisService.redis.HGETALL(key)
        if (user.verified) throw { code: 'ALREADY_VERIFIED' }
        return true
    }
}