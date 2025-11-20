import { Injectable } from '@nestjs/common'
import { PrismaService } from '@database/prisma.service.js'
import { RedisService } from '../redis.service.js'
import { SecurityService } from '@shared/utils/security/security.service.js'
import { FormatterService } from '@shared/utils/formatter/formatter.service.js'
import type Collection from '@type/collection.d.ts'

@Injectable()
export class CacheService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly redisService: RedisService,
        private readonly securityService: SecurityService,
        private readonly formatterService: FormatterService
    ) {}
    async createCollection(keyName: string, user: { id: string }): Promise<Collection[]> {
        const key = this.securityService.sanitizeService.sanitizeRedisKey(keyName, user.id)
        const cache = await this.redisService.redis.json.GET(key)
        if (cache) return cache as Collection[]
        const collection = await this.prismaService.collection.findMany({
            where: {
                user_id: user.id
            }
        })
        const books = this.formatterService.formatBooksMap(collection)
        await this.redisService.redis.json.SET(key, '$', books)
        await this.redisService.redis.EXPIRE(key, 86400)
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
        await this.redisService.redis.json.SET(key, '$', this.formatterService.formatBooksMap(updatedBooks))
        await this.redisService.redis.EXPIRE(key, 86400, 'NX')
        await this.scanAndDelete(keysToDelete)
    }
    async scanAndDelete(key: string): Promise<void> {
        let cursor = '0'
        do {
            const result = await this.redisService.redis.SCAN(cursor, {
                MATCH: key,
                COUNT: 100
            })
            cursor = result.cursor
            if (result.keys.length) await this.redisService.redis.DEL(result.keys)
        } while (cursor !== '0')
    }
}