import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@infrastructure/prisma/generated/client.js'
import { PrismaPg } from '@prisma/adapter-pg'
import type { OnModuleInit, OnModuleDestroy } from '@nestjs/common'

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