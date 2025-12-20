import { Injectable } from '@nestjs/common'
import type { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { from, switchMap, tap, type Observable } from 'rxjs'
import { VerificationService } from '@modules/auth/services/verification.service.js'
import type RegisterResult from '@type/auth/register-result.d.ts'

@Injectable()
export class RegisterInterceptor implements NestInterceptor {
    constructor(private readonly verificationService: VerificationService) {}
    intercept(context: ExecutionContext, next: CallHandler<RegisterResult>): Observable<string> {
        const ctx = GqlExecutionContext.create(context)
        const { req, res } = ctx.getContext()
        return next.handle().pipe(
            tap(({ user }) => this.verificationService.generateCode('verify', user, false)),
            switchMap(({ user, identity }) => from(this.verificationService.generateToken(req, res, identity, user.id)))
        )
    }
}