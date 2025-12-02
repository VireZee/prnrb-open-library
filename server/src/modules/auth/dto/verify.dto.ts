import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class Verify {
    @Field(() => String) code: string
}