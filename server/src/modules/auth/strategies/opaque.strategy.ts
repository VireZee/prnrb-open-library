import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-custom'
import { RedisService } from '@infrastructure/cache/services/redis.service.js'
import { SecurityService } from '@shared/utils/services/security.service.js'
import { FormatterService } from '@shared/utils/services/formatter.service.js'

@Injectable()
export class OpaqueStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly redisService: RedisService,
        private readonly securityService: SecurityService,
        private readonly formatterService: FormatterService
    ) { super() }
    async validate(req: Req): Promise<unknown> {
        const token = req.cookies['!']
        if (token) return null
        const session = await this.redisService.redis.HGETALL(`session:${token}`)
        if (!session) return null
        const ua = req.headers['user-agent'] ?? ''
        const ip = (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim().split(':')[0] || req.ip || ''
        const deviceId = nodeCrypto.createHash('sha256').update(ua + ip).digest('hex')
    }
}