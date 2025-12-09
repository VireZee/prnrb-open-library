import { ArgsType, InputType, Field } from '@nestjs/graphql'

@ArgsType()
export class Register {
    @Field(() => String) name: string
    @Field(() => String) username: string
    @Field(() => String) email: string
    @Field(() => String) pass: string
    @Field(() => String, { nullable: true }) rePass?: string
    @Field(() => Boolean) show: boolean
    @Field(() => Identity) identity: Identity
}
@InputType()
class Identity {
    @Field(() => String) platform: string
    @Field(() => String) tz: string
    @Field(() => String) screenRes: string
    @Field(() => String) colorDepth: string
    @Field(() => String) devicePixelRatio: string
    @Field(() => String) touchSupport: string
    @Field(() => String) hardwareConcurrency: string
}