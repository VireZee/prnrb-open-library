import { Controller, Get, Param, Res } from '@nestjs/common'
import { RedisService } from '@infrastructure/cache/services/redis.service.js'
import { SecurityService } from '@shared/utils/services/security.service.js'
import { VerifyService } from '@modules/auth/services/verify.service.js'
import type { User } from '@type/auth/user.d.ts'

@Controller('verify')
export class VerifyController {
    constructor(
        private readonly redisService: RedisService,
        private readonly securityService: SecurityService,
        private readonly verifyService: VerifyService,
    ) {}
    @Get(':id/:token')
    async _(
        @Param('id') id: string,
        @Param('token') token: string,
        @Res() res: Res
    ): Promise<void> {
        const userKey = this.securityService.sanitizeRedisKey('user', id!)
        const verifyKey = this.securityService.sanitizeRedisKey('verify', id!)
        const user = await this.redisService.redis.json.GET(userKey) as User
        const code = await this.redisService.redis.HGET(verifyKey, 'code')
        if (!user!.verified && token !== code) return res.redirect(`http://${process.env['DOMAIN']}:${process.env['CLIENT_PORT']}/error`)
        await this.verifyService.setToVerified(id!)
        return res.redirect(`http://${process.env['DOMAIN']}:${process.env['CLIENT_PORT']}`)
    }
}