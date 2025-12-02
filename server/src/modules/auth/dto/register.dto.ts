import { ArgsType, Field } from '@nestjs/graphql'

@ArgsType()
export class Register {
    @Field(() => String) name: string
    @Field(() => String) username: string
    @Field(() => String) email: string
    @Field(() => String) pass: string
    @Field(() => String, { nullable: true }) rePass?: string
    @Field(() => Boolean) show: boolean
}