import { Injectable } from '@nestjs/common'
import type { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { tap, type Observable } from 'rxjs'

@Injectable()
export class LogoutInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<void>): Observable<void> {
        const ctx = GqlExecutionContext.create(context)
        const { res } = ctx.getContext()
        return next.handle().pipe(
            tap(() => {
                res.clearCookie('!')
            })
        )
    }
}