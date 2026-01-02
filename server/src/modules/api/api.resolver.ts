import { UseGuards } from '@nestjs/common'
import { Resolver, Query, Mutation, Context } from '@nestjs/graphql'
import { AuthGuard } from '@common/guards/auth.guard.js'
import { CheckService } from './services/check.service.js'
import { GenerateService } from './services/generate.service.js'
import type { User } from '@type/auth/user.d.ts'

@Resolver()
export class ApiResolver {
    constructor(
        private readonly checkService: CheckService,
        private readonly generateService: GenerateService
    ) {}
    @UseGuards(AuthGuard)
    @Query(() => String, { nullable: true })
    async check(@Context('req') req: Req & { user: User }): Promise<string | null> { return this.checkService.check(req.user) }
    @UseGuards(AuthGuard)
    @Mutation(() => String)
    async generate(@Context('req') req: Req & { user: User }): Promise<string> { return this.generateService.generate(req.user) }
}