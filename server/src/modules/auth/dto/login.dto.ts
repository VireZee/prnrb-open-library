import { ArgsType, InputType, Field } from '@nestjs/graphql'

@ArgsType()
export class Login {
    @Field(() => String) emailOrUsername: string
    @Field(() => String) pass: string
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