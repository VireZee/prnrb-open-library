import { ArgsType, Field, Int } from '@nestjs/graphql'

@ArgsType()
export class Search {
    @Field(() => String, { nullable: true }) search?: string
    @Field(() => Int) page: number
}