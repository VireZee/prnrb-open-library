import { Injectable } from '@nestjs/common'
import type { OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { createClient, type RedisClientType } from 'redis'

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private redisClient: RedisClientType
    async onModuleInit() {
        this.redisClient = createClient({
            socket: {
                host: process.env['REDIS_HOST'],
                port: Number(process.env['REDIS_PORT'])
            },
            password: process.env['REDIS_PASS']!
        })
        await this.redisClient.connect()
    }
    async onModuleDestroy() {
        await this.redisClient.close()
    }
    protected client() {
        return this.redisClient
    }
}