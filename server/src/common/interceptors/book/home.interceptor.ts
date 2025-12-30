import { Injectable } from '@nestjs/common'
import type { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { RedisService } from '@infrastructure/cache/services/redis.service.js'
import { from, of, switchMap, tap, map, Observable } from 'rxjs'
import { FormatterService } from '@shared/utils/services/formatter.service.js'
import type Collection from '@type/book/collection.d.ts'

@Injectable()
export class HomeInterceptor implements NestInterceptor {
    constructor(
        private readonly redisService: RedisService,
        private readonly formatterService: FormatterService
    ) {}
    intercept(context: ExecutionContext, next: CallHandler<{ numFound: number, docs: Collection[] }>): Observable<{ numFound: number, docs: Collection[] }> {
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