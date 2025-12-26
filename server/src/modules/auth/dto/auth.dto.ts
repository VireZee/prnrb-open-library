import { ObjectType, Field } from "@nestjs/graphql"

@ObjectType()
export class Auth {
    @Field(() => Boolean) google: boolean
    @Field(() => String) photo: string
    @Field(() => String) name: string
    @Field(() => String) username: string
    @Field(() => String) email: string
    @Field(() => Boolean) verified: boolean
}