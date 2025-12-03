import { ArgsType, Field } from '@nestjs/graphql'

@ArgsType()
export class Validate {
    @Field(() => String) id: string
    @Field(() => String) token: string
}