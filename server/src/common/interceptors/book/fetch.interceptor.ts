import { Injectable } from '@nestjs/common'
import type { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { from, of, switchMap, map, type Observable } from 'rxjs'
import { RedisService } from '@infrastructure/redis/services/redis.service.js'
import { SecurityService } from '@shared/utils/services/security.service.js'
import { FormatterService } from '@shared/utils/services/formatter.service.js'
import type { Added } from '@modules/books/dto/added.dto.js'
import type Collection from '@type/book/collection.d.ts'

@Injectable()
export class FetchInterceptor implements NestInterceptor {
    constructor(
        private readonly redisService: RedisService,
        private readonly securityService: SecurityService,
        private readonly formatterService: FormatterService
    ) {}
    intercept(context: ExecutionContext, next: CallHandler<boolean>): Observable<Added> {
        const ctx = GqlExecutionContext.create(context)
        const { author_key, cover_edition_key, cover_i } = ctx.getArgs()
        const { req } = ctx.getContext()
        const { user } = req
        const key = this.securityService.sanitizeRedisKey('collection', user.id)
        return from(this.redisService.redis.json.GET(key).catch(() => null)).pipe(
            switchMap(rawCache => {
                const cache = rawCache as Collection[]
                if (Array.isArray(cache)) {
                    const bookCollection = this.formatterService.formatBooksFind(cache, author_key, cover_edition_key, cover_i)
                    return of({
                        id: `${[...author_key].sort().join(',')}|${cover_edition_key}|${cover_i}`,
                        added: !!bookCollection,
                    })
                }
                return next.handle().pipe(
                    map(added => ({
                        id: `${[...author_key].sort().join(',')}|${cover_edition_key}|${cover_i}`,
                        added
                    }))
                )
            })
        )
    }
}