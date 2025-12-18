import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql'
import { Home } from './dto/home.dto.js'
import type { HomeService } from './services/home.service.js'

@Resolver()
export class BookResolver {
    constructor(
        private readonly homeService: HomeService
    ) { }
    @Query(() => Home)
    async home() {
        return this.homeService.home()
    }
}