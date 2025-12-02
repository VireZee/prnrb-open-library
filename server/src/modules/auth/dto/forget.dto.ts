import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class Forget {
    @Field(() => String) email: string
}