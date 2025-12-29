import { ArgsType, Field, Int } from '@nestjs/graphql'

@ArgsType()
export class Add {
    @Field(() => [String]) author_key: string[]
    @Field(() => String) cover_edition_key: string
    @Field(() => Int) cover_i: number
    @Field(() => String) title: string
    @Field(() => [String]) author_name: string[]
}