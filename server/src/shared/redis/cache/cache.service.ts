import { Injectable } from '@nestjs/common'
import type { PrismaService } from '@database/prisma.service.js'
import { RedisService } from '../redis.service.js'
import type { SecurityService } from '@shared/utils/security/security.service.js'
import type { FormatterService } from '@shared/utils/formatter/formatter.service.js'
import type Collection from '@type/collection.d.ts'

@Injectable()
export class CacheService extends RedisService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly securityService: SecurityService,
        private readonly formatterService: FormatterService
    ) { super() }
    async createCollection(keyName: string, user: { id: string }): Promise<Collection[]> {
        const key = this.securityService.sanitizeService.sanitizeRedisKey(keyName, user.id)
        const cache = await this.redis().json.GET(key)
        if (cache) return cache as Collection[]
        const collection = await this.prismaService.collection.findMany({
            where: {
                user_id: user.id
            }
        })
        const books = this.formatterService.formatBooksMap(collection)
        await this.redis().json.SET(key, '$', books)
        await this.redis().EXPIRE(key, 86400)
        return books
    }
    async updateCollection(keyName: string, user: { id: string }): Promise<void> {
        const key = this.securityService.sanitizeService.sanitizeRedisKey(keyName, user.id)
        const keysToDelete = `${key}|*`
        const updatedBooks = await this.prismaService.collection.findMany({
            where: {
                user_id: user.id
            }
        })
        await this.redis().json.SET(key, '$', this.formatterService.formatBooksMap(updatedBooks))
        await this.redis().EXPIRE(key, 86400, 'NX')
        await this.scanAndDelete(keysToDelete)
    }
    async scanAndDelete(key: string): Promise<void> {
        let cursor = '0'
        do {
            const result = await this.redis().SCAN(cursor, {
                MATCH: key,
                COUNT: 100
            })
            cursor = result.cursor
            if (result.keys.length) await this.redis().DEL(result.keys)
        } while (cursor !== '0')
    }
}