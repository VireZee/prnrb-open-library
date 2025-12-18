import { ArgsType, Field, Int } from '@nestjs/graphql'
import { Book } from './book.dto.js'

@ArgsType()
export class Home {
    @Field(() => Int) numFound: number
    @Field(() => [Book]) docs: Book[]
}