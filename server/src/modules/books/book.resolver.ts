import { UseGuards, UseInterceptors } from '@nestjs/common'
import { Resolver, Query, Args, Context } from '@nestjs/graphql'
import { AuthGuard } from '@common/guards/auth.guard.js'
import { HomeInterceptor } from '@common/interceptors/book/home.interceptor.js'
import { FetchInterceptor } from '@common/interceptors/book/fetch.interceptor.js'
import { HomeService } from './services/home.service.js'
import { FetchService } from './services/fetch.service.js'
import { Home } from './dto/home.dto.js'
import { Fetch } from './dto/fetch.dto.js'
import { Added } from './dto/added.dto.js'
import { Search } from './dto/search.dto.js'
import type { User } from '@type/auth/user.d.ts'

@Resolver()
export class BookResolver {
    constructor(
        private readonly homeService: HomeService,
        private readonly fetchService: FetchService
    ) {}
    @UseInterceptors(HomeInterceptor)
    @Query(() => Home)
    async home(@Args() args: Search) {
        return this.homeService.home(args)
    }
    @UseGuards(AuthGuard)
    @UseInterceptors(FetchInterceptor)
    @Query(() => Added)
    async fetch(
        @Args() args: Fetch,
        @Context('req') ctx: Req & { user: User }
    ): Promise<Boolean> {
        return this.fetchService.fetch(args, ctx.user)
    }
}