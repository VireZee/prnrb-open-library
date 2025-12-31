import { Injectable } from '@nestjs/common'
import type { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { RedisService } from '@infrastructure/cache/services/redis.service.js'
import { SecurityService } from '@shared/utils/services/security.service.js'
import { from, of, switchMap, tap, Observable } from 'rxjs'

@Injectable()
export class CollectionInterceptor implements NestInterceptor {
    constructor(
        private readonly redisService: RedisService,
        private readonly securityService: SecurityService
    ) {}
    intercept(context: ExecutionContext, next: CallHandler) {
        const ctx = GqlExecutionContext.create(context)
        const args = ctx.getArgs()
        const { search, page } = args
        const { user } = ctx.getContext()
        const baseKey = this.securityService.sanitizeRedisKey('collection', user.id)
        const key = search?.trim()
            ? `${baseKey}|${search}|${page}`
            : `${baseKey}|${page}`
        return from(this.redisService.redis.json.GET(key)).pipe(
            switchMap(cache => {
                if (cache) return of(cache)
                return next.handle().pipe(
                    tap(collection => {
                        this.redisService.redis.json.SET(key, '$', collection)
                        this.redisService.redis.EXPIRE(key, 86400)
                    })
                )
            })
        )
    }
}