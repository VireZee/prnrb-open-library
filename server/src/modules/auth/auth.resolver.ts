import { Resolver, Mutation, Args, Context } from '@nestjs/graphql'
import { RegisterPipe } from '@common/pipes/auth/register.pipe.js'
import { RegisterService } from './services/register.service.js'
import { VerifyService } from './services/verify.service.js'
import { Register } from './dto/register.dto.js'
import { Verify } from './dto/verify.dto.js'
import type { User } from '@type/user.d.ts'

@Resolver()
export class AuthResolver {
    constructor(
        private readonly registerService: RegisterService,
        private readonly verifyService: VerifyService
    ) {}
    @Mutation(() => Boolean)
    async register(
        @Args(RegisterPipe) args: Register,
        @Context() context: { res: Res }
    ): Promise<boolean> {
        return this.registerService.register(args, context.res)
    }
    @Mutation(() => Boolean)
    async verify(
        @Args() args: Verify,
        @Context() context: { user: User }
    ): Promise<boolean> {
        return this.verifyService.verify(args, context.user)
    }
}