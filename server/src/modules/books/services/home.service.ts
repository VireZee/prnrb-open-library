import { Injectable } from '@nestjs/common'
import { RetryService } from '@common/workers/services/retry.service.js'
import type { Search } from '../dto/search.dto.js'
import type { Home } from '../dto/home.dto.js'
import got from 'got'
import REGEX from '@shared/constants/regex.constant.js'

@Injectable()
export class HomeService {
    constructor(private readonly retryService: RetryService) {}
    async home(args: Search): Promise<Home> {
        const { search, page } = args
        const type = REGEX.ISBN.test(search!) ? 'isbn' : 'title'
        const response = await this.retryService.retry(() => got(`https://openlibrary.org/search.json`, {
            searchParams: { [type]: search, page }, timeout: { request: 3000 }
        }).json<Home>(), {})
        return {
            numFound: response.numFound,
            docs: response.docs
        }
    }
}