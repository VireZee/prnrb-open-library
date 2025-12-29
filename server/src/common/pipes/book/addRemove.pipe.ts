import { Injectable, type PipeTransform } from '@nestjs/common'
import { ApolloServerErrorCode } from '@apollo/server/errors'
import type { Add } from '@modules/books/dto/add.dto.js'

@Injectable()
export class AddRemovePipe implements PipeTransform {
    transform(value: Add): Add {
        const { author_key, cover_edition_key, cover_i } = value
        if (!Array.isArray(author_key) || author_key.length === 0 || !cover_edition_key || !cover_i) throw { message: 'Invalid input', code: ApolloServerErrorCode.BAD_USER_INPUT }
        return value
    }
}