import { ArgsType, Field } from '@nestjs/graphql'

@ArgsType()
export class Forget {
    @Field(() => String) email: string
}