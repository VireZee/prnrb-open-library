import { Injectable, type PipeTransform } from '@nestjs/common'
import type { Search } from '@modules/books/dto/search.dto.js'
import REGEX from '@shared/constants/regex.constant.js'

@Injectable()
export class HomePipe implements PipeTransform {
    transform(value: Search): { page: number, type: string, formattedSearch: string } {
        const isIsbn = REGEX.ISBN.test(value.search)
        return {
            page: value.page,
            type: isIsbn ? 'isbn' : 'title',
            formattedSearch: value.search.replace(REGEX.WHITESPACES, '+')
        }
    }
}