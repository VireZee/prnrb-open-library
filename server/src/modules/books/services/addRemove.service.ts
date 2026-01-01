import { Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/database/prisma.service.js'
import { PublisherService } from '@infrastructure/cache/services/publisher.service.js'
import type { Add } from '../dto/add.dto.js'
import type { Fetch } from '../dto/fetch.dto.js'
import type { User } from '@type/auth/user.d.ts'
import type Collection from '@type/book/collection.d.ts'

@Injectable()
export class AddRemoveService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly publisherService: PublisherService
    ) {}
    private async exist(user_id: string, author_key: string[], cover_edition_key: string, cover_i: number): Promise<Collection & { id: string, user_id: string | null, created: Date } | null> {
        return await this.prismaService.collection.findFirst({
            where: {
                user_id,
                author_key: { equals: author_key },
                cover_edition_key,
                cover_i
            }
        })
    }
    async add(args: Add, user: User): Promise<true> {
        const { author_key, cover_edition_key, cover_i, title, author_name } = args
        const exist = await this.exist(user.id, author_key, cover_edition_key, cover_i)
        if (!exist) {
            await this.prismaService.collection.create({
                data: {
                    user_id: user.id,
                    author_key,
                    cover_edition_key,
                    cover_i,
                    title,
                    author_name
                }
            })
            await this.publisherService.publish('collection:update', user.id)
        }
        return true
    }
    async remove(args: Fetch, user: User): Promise<true> {
        const { author_key, cover_edition_key, cover_i } = args
        const exist = await this.exist(user.id, author_key, cover_edition_key, cover_i)
        if (exist) {
            await this.prismaService.collection.delete({ where: { id: exist.id } })
            await this.publisherService.publish('collection:update', user.id)
        }
        return true
    }
}