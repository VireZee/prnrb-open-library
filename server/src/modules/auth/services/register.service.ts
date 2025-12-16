import { Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/database/prisma.service.js'
import { SecurityService } from '@shared/utils/services/security.service.js'
import { FormatterService } from '@shared/utils/services/formatter.service.js'
import { MiscService } from '@shared/utils/services/misc.service.js'
import { VerificationService } from './verification.service.js'
import type { Register } from '../dto/register.dto.js'

@Injectable()
export class RegisterService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly securityService: SecurityService,
        private readonly formatterService: FormatterService,
        private readonly miscService: MiscService,
        private readonly verificationService: VerificationService
    ) {}
    async register(args: Register, ctx: { req: Req, res: Res }): Promise<string> {
        const { name, username, email, pass, identity } = args
        const { req, res } = ctx
        const newUser = await this.prismaService.user.create({
            data: {
                photo: Buffer.from(this.miscService.generateAvatar(name), 'base64'),
                name: this.formatterService.formatName(name),
                username: this.formatterService.formatUsername(username),
                email,
                pass: await this.securityService.hash(pass)
            }
        })
        await this.verificationService.generateCode('verify', newUser, false)
        return this.verificationService.generateToken(req, res, identity, newUser.id)
    }
}