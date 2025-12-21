import { Injectable } from '@nestjs/common'
import { CacheService } from '@infrastructure/cache/services/cache.service.js'
import { FormatterService } from '@shared/utils/services/formatter.service.js'
import type { Fetch } from '../dto/fetch.dto.js'
import type { User } from '@type/auth/user.d.ts'
import type Collection from '@type/book/collection.d.ts'

@Injectable()
export class FetchService {
    constructor(
        private readonly cacheService: CacheService,
        private readonly formatterService: FormatterService
    ) {}
    async fetch(args: Fetch, user: User): Promise<boolean> {
        const { author_key, cover_edition_key, cover_i } = args
        const books = await this.cacheService.createCollection('collection', user) as Collection[]
        const bookCollection = this.formatterService.formatBooksFind(books, author_key, cover_edition_key, cover_i)
        return !!bookCollection
    }
}