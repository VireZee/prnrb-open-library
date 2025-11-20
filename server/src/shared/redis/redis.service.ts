import { Injectable } from '@nestjs/common'
import type { OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { createClient, type RedisClientType } from 'redis'
import { CacheService } from './cache/cache.service.js'

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    constructor(readonly cacheService: CacheService) {}
    redis: RedisClientType
    async onModuleInit(): Promise<void> {
        this.redis = createClient({
            socket: {
                host: process.env['REDIS_HOST'],
                port: Number(process.env['REDIS_PORT'])
            },
            password: process.env['REDIS_PASS']!
        })
        await this.redis.connect()
    }
    async onModuleDestroy(): Promise<void> {
        await this.redis.close()
    }
}