import { Injectable } from '@nestjs/common'
import type { OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { createClient, type RedisClientType } from 'redis'

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private redisClient: RedisClientType
    async onModuleInit(): Promise<void> {
        this.redisClient = createClient({
            socket: {
                host: process.env['REDIS_HOST'],
                port: Number(process.env['REDIS_PORT'])
            },
            password: process.env['REDIS_PASS']!
        })
        await this.redisClient.connect()
    }
    async onModuleDestroy(): Promise<void> {
        await this.redisClient.close()
    }
    protected redis(): RedisClientType {
        return this.redisClient
    }
}