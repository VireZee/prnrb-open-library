import { Injectable } from '@nestjs/common'
import type { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { from, switchMap, type Observable } from 'rxjs'
import { VerificationService } from '@modules/auth/services/verification.service.js'
import type { LoginResult } from '@type/auth/auth-result.d.ts'

@Injectable()
export class LoginInterceptor implements NestInterceptor {
    constructor(private readonly verificationService: VerificationService) {}
    intercept(context: ExecutionContext, next: CallHandler<LoginResult>): Observable<string> {
        const ctx = GqlExecutionContext.create(context)
        const { req, res } = ctx.getContext()
        return next.handle().pipe(
            switchMap(({ id, identity }) => from(this.verificationService.generateToken(req, res, identity, id)))
        )
    }
}