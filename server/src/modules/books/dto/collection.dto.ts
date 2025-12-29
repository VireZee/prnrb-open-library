import { ObjectType, Field, Int } from '@nestjs/graphql'
import { Book } from './book.dto.js'

@ObjectType()
export class Collection {
    @Field(() => Int) found: number
    @Field(() => [Book]) collection: Book[]
    @Field(() => Int) totalCollection: number
}