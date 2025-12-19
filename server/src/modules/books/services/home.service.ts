import { Injectable } from '@nestjs/common'
import { RedisService } from '@infrastructure/cache/services/redis.service.js'
import type { Search } from '../dto/search.dto.js'
import type { FormatterService } from '@shared/utils/services/formatter.service.js'
import type Collection from '@type/collection.d.ts'

@Injectable()
export class HomeService {
    constructor(
        private readonly redisService: RedisService,
        private readonly formatterService: FormatterService

    ) {}
    async home(args: Search) {
        const { search, page } = args
        const key = `book:${search}|${page}`
        const cache = await this.redisService.redis.json.GET(key)
        if (cache) return {
            numFound: (cache as { numFound: number }).numFound,
            docs: this.formatterService.formatBooksMap((cache as { docs: Collection[] }).docs)
        }
    }
}