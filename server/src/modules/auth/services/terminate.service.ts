import type { RedisService } from '@infrastructure/cache/services/redis.service.js';
import type { PrismaService } from '@infrastructure/database/prisma.service.js';
import { Injectable } from '@nestjs/common'

@Injectable()
export class TerminateService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly redisService: RedisService
    ) {}
    async terminate() {
        
    }
}