import { Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/database/prisma.service.js'
import { CacheService } from '@infrastructure/cache/services/cache.service.js'
import { SecurityService } from '@shared/utils/services/security.service.js'
import type { User } from '@type/auth/user.d.ts'

@Injectable()
export class TerminateService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly cacheService: CacheService,
        private readonly securityService: SecurityService
    ) {}
    async terminate(res: Res & { user: User }): Promise<true> {
        const { user } = res
        const key = this.securityService.sanitize(user.id)
        const keysToDelete = `*${key}*`
        await this.prismaService.collection.deleteMany({ where: { user_id: user.id } })
        await this.prismaService.user.delete({ where: { id: user.id } })
        await this.cacheService.scanAndDelete(keysToDelete)
        return true
    }
}