import { Injectable } from '@nestjs/common'
import type { OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@infrastructure/prisma/generated/client.js'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        const adapter = new PrismaPg({ connectionString: `${process.env['DB_URL']}` })
        super({ adapter })
    }
    async onModuleInit(): Promise<void> {
        await this.$connect()
    }
    async onModuleDestroy(): Promise<void> {
        await this.$disconnect()
    }
}