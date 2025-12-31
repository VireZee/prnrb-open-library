import { Injectable, type PipeTransform } from '@nestjs/common'
import { ApolloServerErrorCode } from '@apollo/server/errors'
import type { Fetch } from '@modules/books/dto/fetch.dto.js'

@Injectable()
export class AddRemovePipe implements PipeTransform {
    transform(value: Fetch): Fetch {
        const { author_key, cover_edition_key, cover_i } = value
        if (!Array.isArray(author_key) || author_key.length === 0 || !cover_edition_key || !cover_i) throw { message: 'Invalid input!', code: ApolloServerErrorCode.BAD_USER_INPUT }
        return value
    }
}