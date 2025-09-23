import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class Register {
    @Field(() => String)
    name: string
    @Field(() => String)
    username: string
    @Field(() => String)
    email: string
    @Field(() => String)
    pass: string
    @Field({ nullable: true })
    rePass?: string
    @Field(() => Boolean)
    show: boolean
}this