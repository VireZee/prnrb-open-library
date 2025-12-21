import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType()
export class Added {
    @Field(() => String) id: string
    @Field(() => Boolean) added: boolean
}