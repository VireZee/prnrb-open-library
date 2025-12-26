import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class Identity {
    @Field(() => String) tz: string
    @Field(() => String) screenRes: string
    @Field(() => String) colorDepth: string
    @Field(() => String) devicePixelRatio: string
    @Field(() => String) touchSupport: string
    @Field(() => String) hardwareConcurrency: string
}