import { Injectable } from '@nestjs/common'
import { AccountService } from '@shared/account/account.service.js'
import type { User } from '@type/user.js'

@Injectable()
export class ResendService {
    constructor(private readonly accountService: AccountService) {}
    async resend(user: User) {
        await this.accountService.checkBlock('verify', user, 'You have been temporarily blocked from verifying your code due to too many failed attempts! Try again in')
        await this.accountService.checkBlock('resend', user, 'Too many resend attempts! Try again in')
        await this.accountService.rateLimiter('resend', user, 60, 'verify')
        await this.accountService.generateCode('verify', user, false)
        return true
    }
}