import { Injectable, type ExecutionContext } from '@nestjs/common'
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport'
import { GqlExecutionContext } from '@nestjs/graphql'
import ERROR from '../constants/error.constant.js'
import type { User } from '@type/user.d.ts'

@Injectable()
export class AuthGuard extends PassportAuthGuard() {
    override getRequest(context: ExecutionContext): Req {
        const ctx = GqlExecutionContext.create(context)
        return ctx.getContext().req
    }
    override handleRequest<T = User>(err: Error, user: User): T | never {
        if (err) throw err
        if (!user) throw { code: ERROR.UNAUTHENTICATED }
        return user as T
    }
}