import { Injectable } from '@nestjs/common'
import type { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { from, of, switchMap, tap, map, type Observable } from 'rxjs'
import { RedisService } from '@infrastructure/cache/services/redis.service.js'
import { FormatterService } from '@shared/utils/services/formatter.service.js'
import type { Home } from '@modules/books/dto/home.dto.js'
import type Collection from '@type/book/collection.js'

@Injectable()
export class HomeInterceptor implements NestInterceptor {
    constructor(
        private readonly redisService: RedisService,
        private readonly formatterService: FormatterService
    ) {}
    intercept(context: ExecutionContext, next: CallHandler<Home>): Observable<Home> {
        const ctx = GqlExecutionContext.create(context)
        const args = ctx.getArgs()
        const { search, page } = args
        const key = `book:${search}|${page}`
        return from(this.redisService.redis.json.GET(key)).pipe(
            switchMap(cache => {
                if (cache) return of({
                    numFound: (cache as { numFound: number }).numFound,
                    docs: this.formatterService.formatBooksMap((cache as { docs: Collection[] }).docs)
                })
                return next.handle().pipe(
                    map(books => ({
                        numFound: books.numFound,
                        docs: books.docs.map((book: Collection) => ({
                            author_key: book.author_key ?? [],
                            cover_edition_key: book.cover_edition_key ?? '',
                            cover_i: book.cover_i ?? 0,
                            title: book.title ?? 'Unknown Title',
                            author_name: book.author_name ?? ['Unknown Author']
                        }))
                    })),
                    tap(result => {
                        this.redisService.redis.json.SET(key, '$', result)
                        this.redisService.redis.EXPIRE(key, 86400)
                    })
                )
            })
        )
    }
}