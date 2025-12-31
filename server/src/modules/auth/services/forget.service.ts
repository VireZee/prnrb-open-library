import { Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/database/prisma.service.js'
import { VerificationService } from './verification.service.js'
import { RateLimiterService } from './rate-limiter.service.js'
import type { Forget } from '../dto/forget.dto.js'

@Injectable()
export class ForgetService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly verificationService: VerificationService,
        private readonly rateLimiterService: RateLimiterService
    ) {}
    async forget(args: Forget) {
        const { email } = args
        const user = await this.prismaService.user.findUnique({ where: { email } })
        if (user) {
            await this.rateLimiterService.checkBlock('forget', user.id, 'Too many reset requests! Try again in')
            await this.rateLimiterService.rateLimiter('forget', user.id, 60, 'verify')
            await this.verificationService.generateCode('verify', user, true)
        }
        return 'A verification code has been sent to your email address, provided it is registered in our system.'
    }
}