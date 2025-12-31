import { UseGuards, UseInterceptors } from '@nestjs/common'
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql'
import { AuthGuard } from '@common/guards/auth.guard.js'
import { HomeInterceptor } from '@common/interceptors/book/home.interceptor.js'
import { FetchInterceptor } from '@common/interceptors/book/fetch.interceptor.js'
import { AddRemovePipe } from '@common/pipes/book/addRemove.pipe.js'
import { HomeService } from './services/home.service.js'
import { FetchService } from './services/fetch.service.js'
import { AddRemoveService } from './services/addRemove.service.js'
import { CollectionService } from './services/collection.service.js'
import { Home } from './dto/home.dto.js'
import { Fetch } from './dto/fetch.dto.js'
import { Added } from './dto/added.dto.js'
import { Search } from './dto/search.dto.js'
import { Add } from './dto/add.dto.js'
import { Collection } from './dto/collection.dto.js'
import type { User } from '@type/auth/user.d.ts'

@Resolver()
export class BookResolver {
    constructor(
        private readonly homeService: HomeService,
        private readonly fetchService: FetchService,
        private readonly addRemoveService: AddRemoveService,
        private readonly collectionService: CollectionService
    ) {}
    @UseInterceptors(HomeInterceptor)
    @Query(() => Home)
    async home(@Args() args: Search): Promise<Home> {
        return this.homeService.home(args)
    }
    @UseGuards(AuthGuard)
    @UseInterceptors(FetchInterceptor)
    @Query(() => Added)
    async fetch(
        @Args() args: Fetch,
        @Context('req') ctx: { user: User }
    ): Promise<Boolean> {
        return this.fetchService.fetch(args, ctx.user)
    }
    @UseGuards(AuthGuard)
    @Mutation(() => Boolean)
    async add(
        @Args(AddRemovePipe) args: Add,
        @Context('req') ctx: { user: User }
    ): Promise<true> {
        return this.addRemoveService.add(args, ctx.user)
    }
    @UseGuards(AuthGuard)
    @Mutation(() => Boolean)
    async remove(
        @Args(AddRemovePipe) args: Fetch,
        @Context('req') ctx: { user: User }
    ): Promise<true> {
        return this.addRemoveService.remove(args, ctx.user)
    }
    @UseGuards(AuthGuard)
    @Mutation(() => Collection)
    async collection(
        @Args() args: Search,
        @Context('req') ctx: { user: User }
    ): Promise<Collection> {
        return this.collectionService.collection(args, ctx.user)
    }
}