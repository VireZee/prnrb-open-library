import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql'
import { Home } from './dto/home.dto.js'
import { HomeService } from './services/home.service.js'
import { Search } from './dto/search.dto.js'
import { Fetch } from './dto/fetch.dto.js'

@Resolver()
export class BookResolver {
    constructor(
        private readonly homeService: HomeService
    ) { }
    @Query(() => Home)
    async home(@Args() args: Search) {
        return this.homeService.home(args)
    }
    // @Query(() => Fetch)
    // async fetch(@Args() args: Fetch) {
    //     // return this.homeService.home(args)
    // }
}