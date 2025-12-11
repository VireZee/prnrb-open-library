import { Injectable } from '@nestjs/common'
import { VerificationService } from './verification.service.js'
import { RateLimiterService } from './rate-limiter.service.js'
import type { User } from '@type/user.js'

@Injectable()
export class ResendService {
    constructor(
        private readonly verificationService: VerificationService,
        private readonly rateLimiterService: RateLimiterService
    ) {}
    async resend(user: User): Promise<boolean> {
        await this.rateLimiterService.checkBlock('verify', user.id, 'You have been temporarily blocked from verifying your code due to too many failed attempts! Try again in')
        await this.rateLimiterService.checkBlock('resend', user.id, 'Too many resend attempts! Try again in')
        await this.rateLimiterService.rateLimiter('resend', user.id, 60, 'verify')
        await this.verificationService.generateCode('verify', user, false)
        return true
    }
}