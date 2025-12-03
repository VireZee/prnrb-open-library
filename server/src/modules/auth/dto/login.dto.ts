import { ArgsType, Field } from '@nestjs/graphql'

@ArgsType()
export class Login {
    @Field(() => String) emailOrUsername: string
    @Field(() => String) pass: string
}