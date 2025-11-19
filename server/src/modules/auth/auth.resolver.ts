import { Resolver, Mutation, Args, Context } from '@nestjs/graphql'
import type { RegisterService } from './services/register.service.js'
import { RegisterPipe } from '@common/pipe/register.pipe.js'
import type { Register } from './dto/register.dto.js'

@Resolver()
export class AuthResolver {
    constructor(
        private readonly registerService: RegisterService
    ) {}
    @Mutation(() => Boolean)
    async register(
        @Args('args', RegisterPipe) args: Register,
        @Context() context: { res: Res }
    ): Promise<boolean> {
        return this.registerService.register(args, context.res)
    }
}