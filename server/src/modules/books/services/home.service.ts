import { Injectable } from '@nestjs/common'
import type { Search } from '../dto/search.dto.js'
import type { Home } from '../dto/home.dto.js'
import got from 'got'
import REGEX from '@shared/constants/regex.constant.js'

@Injectable()
export class HomeService {
    async home(args: Search): Promise<Home> {
        const { search, page } = args
        const type = REGEX.ISBN.test(search!) ? 'isbn' : 'title'
        const response = await got(`https://openlibrary.org/search.json?${type}=${search}&page=${page}`).json<Home>()
        return {
            numFound: response.numFound,
            docs: response.docs
        }
    }
}