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
        if (!user) throw { message: 'Invalid login credentials!', code: ERROR.INVALID_CREDENTIALS }
        if (user.pass === null) throw { message: 'Account is registered using Google! Try logging in with Google!', code: ERROR.OAUTH_ONLY_ACCOUNT }
        if (!(await this.securityService.verifyHash(pass, user.pass))) throw { message: 'Invalid login credentials!', code: ERROR.INVALID_CREDENTIALS }
        return {
            id: user.id,
            identity
        }
    }
}