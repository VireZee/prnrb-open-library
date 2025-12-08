import { Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/database/prisma.service.js'
import { SecurityService } from '@shared/utils/services/security.service.js'
import { FormatterService } from '@shared/utils/services/formatter.service.js'
import { MiscService } from '@shared/utils/services/misc.service.js'
import { AccountService } from '@shared/account/account.service.js'
import type { Register } from '../dto/register.dto.js'

@Injectable()
export class RegisterService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly securityService: SecurityService,
        private readonly formatterService: FormatterService,
        private readonly miscService: MiscService,
        private readonly accountService: AccountService
    ) {}
    async register(args: Register, res: Res): Promise<boolean> {
        const { name, username, email, pass } = args
        const newUser = await this.prismaService.user.create({
            data: {
                photo: Buffer.from(this.miscService.generateAvatar(name), 'base64'),
                name: this.formatterService.formatName(name),
                username: this.formatterService.formatUsername(username),
                email,
                pass: await this.securityService.hash(pass)
            }
        })
        await this.accountService.generateCode('verify', newUser, false)
        this.accountService.cookie(newUser, res)
        return true
    }
}