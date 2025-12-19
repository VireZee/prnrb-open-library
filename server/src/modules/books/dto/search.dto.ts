import { ArgsType, Field, Int } from '@nestjs/graphql'

@ArgsType()
export class Search {
    @Field(() => String) search: string
    @Field(() => Int) page: number
}