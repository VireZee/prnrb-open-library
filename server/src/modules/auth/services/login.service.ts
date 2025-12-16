import { Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/database/prisma.service.js'
import { SecurityService } from '@shared/utils/services/security.service.js'
import { VerificationService } from './verification.service.js'
import ERROR from '@common/constants/error.constant.js'
import type { Login } from '../dto/login.dto.js'

@Injectable()
export class LoginService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly securityService: SecurityService,
        private readonly verificationService: VerificationService
    ) {}
    async login(args: Login, ctx: ReqRes): Promise<string> {
        const { emailOrUsername, pass, identity } = args
        const { req, res } = ctx
        const user = await this.prismaService.user.findFirst({
            where: {
                OR: [
                    { email: emailOrUsername.toLowerCase() },
                    { username: emailOrUsername.toLowerCase() }
                ]
            }
        })
        if (user!.pass === null) throw { code: ERROR.OAUTH_ONLY_ACCOUNT }
        if ((!user || !(await this.securityService.verifyHash(pass, user.pass!)))) throw { code: ERROR.UNAUTHENTICATED }
        return this.verificationService.generateToken(req, res, identity, user.id)
    }
}