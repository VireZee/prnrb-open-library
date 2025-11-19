import { Injectable, type ExecutionContext } from '@nestjs/common'
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport'
import { GqlExecutionContext } from '@nestjs/graphql'

@Injectable()
export class AuthGuard extends PassportAuthGuard('jwt') {
    override getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context)
        return ctx.getContext().req
    }
    override handleRequest(err: Error, user: any): any {
        if (err) throw err
        if (!user) throw { code: 'UNAUTHENTICATED' }
        return user
    }
}