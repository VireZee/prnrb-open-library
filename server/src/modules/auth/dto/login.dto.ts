import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class Login {
    @Field(() => String) emailOrUsername: string
    @Field(() => String) pass: string
}