import { Injectable } from '@nestjs/common'
import got from 'got'
import type { Search } from '../dto/search.dto.js'
import type Collection from '@type/collection.d.ts'

@Injectable()
export class HomeService {
    async home(args: Omit<Search, 'search'> & {
        type: 'isbn' | 'title'
        formattedSearch: string
    }) {
        const { page, type, formattedSearch } = args
        const response = await got(`https://openlibrary.org/search.json?${type}=${formattedSearch}&page=${page}`).json<{ numFound: number, docs: Collection[] }>()
    }
}