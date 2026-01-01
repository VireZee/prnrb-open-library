import { Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/database/prisma.service.js'
import type { Search } from '../dto/search.dto.js'
import type { Collection } from '../dto/collection.dto.js'
import type { User } from '@type/auth/user.d.ts'

@Injectable()
export class CollectionService {
    constructor(private readonly prismaService: PrismaService) {}
    async collection(args: Search, user: User): Promise<Collection> {
        const { search, page } = args
        const limit = 9
        const query: { user_id: string, title?: { contains: string, mode: 'insensitive' } } = { user_id: user.id }
        if (search) query.title = { contains: search, mode: 'insensitive' }
        const [collection, totalCollection] = await Promise.all([
            this.prismaService.collection.findMany({
                where: query,
                orderBy: { created: 'desc' },
                skip: (page - 1) * limit,
                take: limit
            }),
            this.prismaService.collection.count({ where: query })
        ])
        return {
            found: collection.length,
            collection: collection.map(book => ({
                author_key: book.author_key,
                cover_edition_key: book.cover_edition_key,
                cover_i: book.cover_i,
                title: book.title,
                author_name: book.author_name
            })),
            totalCollection
        }
    }
}