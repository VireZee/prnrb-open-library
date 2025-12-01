import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@infrastructure/prisma/generated/client.js'
import type { OnModuleInit, OnModuleDestroy } from '@nestjs/common'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    async onModuleInit(): Promise<void> {
        await this.$connect()
    }
    async onModuleDestroy(): Promise<void> {
        await this.$disconnect()
    }
}