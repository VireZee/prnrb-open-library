import { ArgsType, Field } from '@nestjs/graphql'

@ArgsType()
export class Settings {
    @Field(() => String) photo: string
    @Field(() => String) name: string
    @Field(() => String) username: string
    @Field(() => String) email: string
    @Field(() => String, { nullable: true }) oldPass?: string
    @Field(() => String, { nullable: true }) newPass?: string
    @Field(() => String, { nullable: true }) rePass?: string
    @Field(() => Boolean) show: boolean
}