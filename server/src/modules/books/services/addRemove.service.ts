import { Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/database/prisma.service.js'
import { RedisService } from '@infrastructure/cache/services/redis.service.js'
import type { Add } from '../dto/add.dto.js'
import type { Fetch } from '../dto/fetch.dto.js'
import type { User } from '@type/auth/user.d.ts'

@Injectable()
export class AddRemoveService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly redisService: RedisService
    ) {}
    private async publish(action: 'ADD' | 'REMOVE', user_id: string, author_key: string[], cover_edition_key: string, cover_i: number): Promise<void> {
        await this.redisService.pub.PUBLISH('collection:update', JSON.stringify({
            action,
            user_id,
            author_key,
            cover_edition_key,
            cover_i
        }))
    }
    async add(args: Add, user: User): Promise<true> {
        const { author_key, cover_edition_key, cover_i, title, author_name } = args
        const existing = await this.prismaService.collection.findFirst({
            where: {
                user_id: user.id,
                author_key: { equals: author_key },
                cover_edition_key,
                cover_i
            }
        })
        if (!existing) await this.prismaService.collection.create({
            data: {
                user_id: user.id,
                author_key,
                cover_edition_key,
                cover_i,
                title,
                author_name
            }
        })
        await this.publish('ADD', user.id, author_key, cover_edition_key, cover_i)
        return true
    }
    async remove(args: Fetch, user: User): Promise<true> {
        const { author_key, cover_edition_key, cover_i } = args
        const existing = await this.prismaService.collection.findFirst({
            where: {
                user_id: user.id,
                author_key: { equals: author_key },
                cover_edition_key,
                cover_i
            }
        })
        if (existing) await this.prismaService.collection.delete({ where: { id: existing.id } })
        await this.publish('REMOVE', user.id, author_key, cover_edition_key, cover_i)
        return true
    }
}