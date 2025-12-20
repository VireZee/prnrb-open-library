import { Injectable } from '@nestjs/common'
import type { Search } from '../dto/search.dto.js'
import got from 'got'
import type Collection from '@type/book/collection.js'

@Injectable()
export class HomeService {
    async home(args: Search & {
        type: 'isbn' | 'title'
    }): Promise<{ numFound: number, docs: Collection[] }> {
        const { search, page, type } = args
        const response = await got(`https://openlibrary.org/search.json?${type}=${search}&page=${page}`).json<{ numFound: number, docs: Collection[] }>()
        return {
            numFound: response.numFound,
            docs: response.docs
        }
    }
}