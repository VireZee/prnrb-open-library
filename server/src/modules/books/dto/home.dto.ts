import { ObjectType, Field, Int } from '@nestjs/graphql'
import { Book } from './book.dto.js'

@ObjectType()
export class Home {
    @Field(() => Int) numFound: number
    @Field(() => [Book]) docs: Book[]
}