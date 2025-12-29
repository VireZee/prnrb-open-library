import { Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/database/prisma.service.js'
import type { Add } from '../dto/add.dto.js'
import type { User } from '@type/auth/user.d.ts'

@Injectable()
export class AddRemoveService {
    constructor(
        private readonly prismaService: PrismaService
    ) {}
    async addRemove(args: Add, user: User): Promise<true> {
        const { author_key, cover_edition_key, cover_i, title, author_name } = args
        const existing = await this.prismaService.collection.findFirst({
            where: {
                user_id: user.id,
                author_key: { equals: author_key },
                cover_edition_key,
                cover_i
            }
        })
        if (existing) await this.prismaService.collection.delete({ where: { id: existing.id } })
        else {
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
        }
        return true
    }
}