import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class Reset {
    @Field(() => String) id: string
    @Field(() => String) token: string
    @Field(() => String) pass: string
    @Field(() => String, { nullable: true }) rePass?: string
    @Field(() => String) show: boolean
}