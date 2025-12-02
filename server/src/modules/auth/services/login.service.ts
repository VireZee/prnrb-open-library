import { Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/database/services/prisma.service.js'
import { SecurityService } from '@shared/utils/security/services/security.service.js'
import { AccountService } from '@shared/account/account.service.js'
import type { Login } from '../dto/login.dto.js'

@Injectable()
export class LoginService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly securityService: SecurityService,
        private readonly accountService: AccountService
    ) { }
    async login(args: Login, res: Res) {
        const { emailOrUsername, pass } = args
        const user = await this.prismaService.user.findFirst({
            where: {
                OR: [
                    { email: emailOrUsername.toLowerCase() },
                    { username: emailOrUsername.toLowerCase() }
                ]
            }
        })
        if (user!.pass === null) throw { code: 'OAUTH_ONLY_ACCOUNT' }
        if ((!user || !(await this.securityService.hashService.verifyHash(pass, user.pass!)))) throw { code: 'UNAUTHENTICATED' }
        this.accountService.cookie(user, res)
        return true
    }
}