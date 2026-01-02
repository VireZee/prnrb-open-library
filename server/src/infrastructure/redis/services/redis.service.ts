import { Injectable } from '@nestjs/common'
import type { OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { createClient, type RedisClientType } from 'redis'

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    redis: RedisClientType
    pub: RedisClientType
    sub: RedisClientType
    async onModuleInit(): Promise<void> {
        this.redis = createClient({ url: process.env['REDIS_URL']! })
        this.pub = this.redis.duplicate()
        this.sub = this.redis.duplicate()
        await this.redis.connect()
        await this.pub.connect()
        await this.sub.connect()
    }
    async onModuleDestroy(): Promise<void> {
        await this.redis.close()
        await this.pub.close()
        await this.sub.close()
    }
}