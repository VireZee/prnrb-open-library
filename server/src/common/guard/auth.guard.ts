import { Injectable, type ExecutionContext } from '@nestjs/common'
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport'
import { GqlExecutionContext } from '@nestjs/graphql'
import type { MiscService } from '@shared/utils/misc/misc.service.js'

@Injectable()
export class AuthGuard extends PassportAuthGuard('jwt') {
    constructor(private readonly miscService: MiscService) { super() }
    override getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context)
        return ctx.getContext().req
    }
    override handleRequest(err: any, user: any) {
        if (err) throw err
        if (!user) this.miscService.graphqlError('Unauthorized')
        return user
    }
}