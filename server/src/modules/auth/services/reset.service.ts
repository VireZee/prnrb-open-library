import { Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/database/prisma.service.js'
import { RedisService } from '@infrastructure/cache/services/redis.service.js'
import { SecurityService } from '@shared/utils/services/security.service.js'
import type { Reset } from '../dto/reset.dto.js'

@Injectable()
export class ResetService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly redisService: RedisService,
        private readonly securityService: SecurityService
    ) {}
    async reset(args: Reset, res: Res): Promise<boolean> {
        const { id, token, pass } = args
        const verifyKey = this.securityService.sanitizeRedisKey('verify', id)
        const forgetKey = this.securityService.sanitizeRedisKey('forget', id)
        const code = await this.redisService.redis.HGET(verifyKey, 'code')
        if (token !== code) {
            res.redirect(`http://${process.env['DOMAIN']}:${process.env['CLIENT_PORT']}/invalid`)
            return false
        }
        const hashed = await this.securityService.hash(pass)
        await this.prismaService.user.update({
            where: { id },
            data: {
                pass: hashed,
                updated: new Date()
            }
        })
        await this.redisService.redis.DEL([verifyKey, forgetKey])
        return true
    }
}