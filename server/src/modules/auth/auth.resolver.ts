import { UsePipes } from '@nestjs/common'
import { Resolver, Mutation, Args, Context } from '@nestjs/graphql'
import { RegisterPipe } from '@common/pipes/register.pipe.js'
import { RegisterService } from './services/register.service.js'
import { Register } from './dto/register.dto.js'

@Resolver()
export class AuthResolver {
    constructor(
        private readonly registerService: RegisterService
    ) {}
    @UsePipes(RegisterPipe)
    @Mutation(() => Boolean)
    async register(
        @Args('args') args: Register,
        @Context() context: { res: Res }
    ): Promise<boolean> {
        return this.registerService.register(args, context.res)
    }
}