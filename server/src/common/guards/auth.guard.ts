import { Injectable, type ExecutionContext } from '@nestjs/common'
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport'
import { GqlExecutionContext } from '@nestjs/graphql'
import ERROR from '../constants/error.constant.js'
import type { User } from '@type/auth/user.d.ts'

@Injectable()
export class AuthGuard extends PassportAuthGuard('opaque') {
    override getRequest(context: ExecutionContext): Req {
        const ctx = GqlExecutionContext.create(context)
        return ctx.getContext().req
    }
    override handleRequest<T = User>(err: Error, user: User): T | never {
        if (err) throw err
        if (!user) throw { code: ERROR.TOKEN_EXPIRED }
        return user as T
    }
}