import { Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/database/prisma.service.js'
import { SecurityService } from '@shared/utils/services/security.service.js'
import { MiscService } from '@shared/utils/services/misc.service.js'
import type { Register } from '../dto/register.dto.js'
import type { RegisterResult } from '@type/auth/auth-result.d.ts'

@Injectable()
export class RegisterService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly securityService: SecurityService,
        private readonly miscService: MiscService
    ) {}
    async register(args: Register): Promise<RegisterResult> {
        const { name, username, email, pass, identity } = args
        const newUser = await this.prismaService.user.create({
            data: {
                photo: Buffer.from(this.miscService.generateAvatar(name), 'base64'),
                name,
                username,
                email,
                pass: await this.securityService.hash(pass)
            }
        })
        return {
            user: { id: newUser.id, email: newUser.email },
            identity
        }
    }
}