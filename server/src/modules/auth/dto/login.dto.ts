import { ArgsType, Field } from '@nestjs/graphql'
import { Identity } from './identity.dto.js'

@ArgsType()
export class Login {
    @Field(() => String) emailOrUsername: string
    @Field(() => String) pass: string
    @Field(() => Identity) identity: Identity
}