import { Injectable, Res } from '@nestjs/common'
import type { SecurityService } from '@shared/utils/security/security.service.js'

@Injectable()
export class AccountService {
    constructor(private readonly securityService: SecurityService) {}
    generateCode() {}
    cookie(user: { id: string }, @Res({ passthrough: true }) res: Res) {
        const token = this.securityService.jwtSign(user.id)
        res.cookie('!', token, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            priority: "high"
        })
    }
    setToVerified() {}
    rateLimiter() {}
    block() {}
}