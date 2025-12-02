import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class Validate {
    @Field(() => String) id: string
    @Field(() => String) token: string
}