import { Injectable } from '@nestjs/common'
import type { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { tap, type Observable } from 'rxjs'
import { RedisService } from '@infrastructure/cache/services/redis.service.js'
import { SecurityService } from '@shared/utils/services/security.service.js'
import type { BaseUser } from '@type/auth/user.d.ts'

@Injectable()
export class SettingsInterceptor implements NestInterceptor {
    constructor(
        private readonly redisService: RedisService,
        private readonly securityService: SecurityService
    ) {}
    intercept(context: ExecutionContext, next: CallHandler<BaseUser>): Observable<BaseUser> {
        const ctx = GqlExecutionContext.create(context)
        const { user } = ctx.getContext()
        return next.handle().pipe(
            tap(async (update) => {
                if (Object.keys(update).length === 0) return
                const key = this.securityService.sanitizeRedisKey('user', user.id)
                if (update.photo) await this.redisService.redis.json.SET(key, '$.photo', Buffer.from(update.photo).toString('base64'))
                if (update.name) await this.redisService.redis.json.SET(key, '$.name', update.name)
                if (update.username) await this.redisService.redis.json.SET(key, '$.username', update.username)
                if (update.email) await this.redisService.redis.json.SET(key, '$.email', update.email)
            })
        )
    }
}