import { ArgsType, Field } from '@nestjs/graphql'

@ArgsType()
export class Reset {
    @Field(() => String) id: string
    @Field(() => String) token: string
    @Field(() => String) pass: string
    @Field(() => String, { nullable: true }) rePass?: string
    @Field(() => Boolean) show: boolean
}