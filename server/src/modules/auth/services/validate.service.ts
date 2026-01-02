import { Injectable } from '@nestjs/common'
import { RedisService } from '@infrastructure/redis/services/redis.service.js'
import { SecurityService } from '@shared/utils/services/security.service.js'
import type { Validate } from '../dto/validate.dto.js'

@Injectable()
export class ValidateService {
    constructor(
        private readonly redisService: RedisService,
        private readonly securityService: SecurityService
    ) {}
    async validate(args: Validate): Promise<boolean> {
        const { id, token } = args
        const key = this.securityService.sanitizeRedisKey('verify', id)
        const code = await this.redisService.redis.HGET(key, 'code')
        return token === code
    }
}