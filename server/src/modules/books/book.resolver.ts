import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql'
import { Home } from './dto/home.dto.js'
import { HomeService } from './services/home.service.js'
import { Search } from './dto/search.dto.js'
import { HomePipe } from '@common/pipes/book/home.pipe.js'
import { UseInterceptors } from '@nestjs/common'
import { HomeInterceptor } from '@common/interceptors/book/home.interceptor.js'

@Resolver()
export class BookResolver {
    constructor(
        private readonly homeService: HomeService
    ) { }
    @UseInterceptors(HomeInterceptor)
    @Query(() => Home)
    async home(@Args(HomePipe) args: Search & { type: 'isbn' | 'title' }) {
        return this.homeService.home(args)
    }
    // @Query(() => Fetch)
    // async fetch(@Args() args: Fetch) {
    //     // return this.homeService.home(args)
    // }
}