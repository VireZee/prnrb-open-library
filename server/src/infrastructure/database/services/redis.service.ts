import { Injectable } from '@nestjs/common'
import type { OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { createClient, type RedisClientType } from 'redis'

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    redis: RedisClientType
    async onModuleInit(): Promise<void> {
        this.redis = createClient({ url: process.env['REDIS_URL']! })
        await this.redis.connect()
    }
    async onModuleDestroy(): Promise<void> {
        await this.redis.close()
    }
}