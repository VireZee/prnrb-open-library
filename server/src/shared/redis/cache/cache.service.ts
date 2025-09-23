import { Injectable } from '@nestjs/common'
import type { PrismaService } from '@database/prisma.service.js'
import { RedisService } from '../redis.service.js'
import type { SecurityService } from '@shared/utils/security/security.service.js'

@Injectable()
export class CacheService extends RedisService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly securityService: SecurityService,
    ) { super() }
    async createCollection(keyName: string, user: { id: string }) {
        const client = this.client()
        const key = this.securityService.sanitizeService.sanitizeRedisKey(keyName, user.id)
        const cache = await client.json.GET(key)
        if (cache) return cache
        const collection = await this.prismaService.collection.findMany({
            where: {
                user_id: user.id
            }
        })
        const books = formatBooksMap(collection)
        await client.json.SET(key, '$', books)
        await client.EXPIRE(key, 86400)
        return books
    }
    async scanAndDelete(key: string): Promise<void> {
        let cursor = '0'
        do {
            const result = await this.client().SCAN(cursor, {
                MATCH: key,
                COUNT: 100
            })
            cursor = result.cursor
            if (result.keys.length) await this.client().DEL(result.keys)
        } while (cursor !== '0')
    }
}