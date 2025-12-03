import { ObjectType, Field, Int } from '@nestjs/graphql'

@ObjectType()
export class Book {
    @Field(() => [String]) author_key: string[]
    @Field(() => String) cover_edition_key: string
    @Field(() => Int) cover_i: number
    @Field(() => String) title: string
    @Field(() => [String]) author_name: string[]
}