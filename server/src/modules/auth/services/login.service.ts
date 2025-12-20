import { Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/database/prisma.service.js'
import { SecurityService } from '@shared/utils/services/security.service.js'
import type { Login } from '../dto/login.dto.js'
import ERROR from '@common/constants/error.constant.js'
import type { LoginResult } from '@type/auth/auth-result.d.ts'

@Injectable()
export class LoginService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly securityService: SecurityService
    ) {}
    async login(args: Login): Promise<LoginResult> {
        const { emailOrUsername, pass, identity } = args
        const user = await this.prismaService.user.findFirst({
            where: {
                OR: [
                    { email: emailOrUsername },
                    { username: emailOrUsername }
                ]
            }
        })
        if (user!.pass === null) throw { code: ERROR.OAUTH_ONLY_ACCOUNT }
        if ((!user || !(await this.securityService.verifyHash(pass, user.pass!)))) throw { code: ERROR.UNAUTHENTICATED }
        return {
            id: user.id,
            identity
        }
    }
}