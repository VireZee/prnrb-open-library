import { Injectable } from '@nestjs/common'
import type { RedisService } from '../redis.service.js'

@Injectable()
export class ScanDeleteService {
    constructor(private readonly redisService: RedisService) {}
    async scanAndDelete(key: string) {
        const client = this.redisService.client()
        let cursor = '0'
        do {
            const result = await client.SCAN(cursor, {
                MATCH: key,
                COUNT: 100
            })
            cursor = result.cursor
            if (result.keys.length) await client.DEL(result.keys)
        } while (cursor !== '0')
    }
}