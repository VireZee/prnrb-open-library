import { Injectable } from '@nestjs/common'
import type { PrismaService } from '@database/prisma.service.js'
import type { RedisService } from '../redis.service.js'

@Injectable()
export class CreateCollectionService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly redisService: RedisService
    ) {}
    async createCollection(keyName: string, user: { id: string }) {
        const client = this.redisService.client()
        const key = sanitizeRedisKey(keyName, user.id)
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
}