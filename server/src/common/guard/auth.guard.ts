import { Injectable } from '@nestjs/common'
import type { CanActivate, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

@Injectable()
export class AuthGuard implements CanActivate {
    constructor() { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context)
        const req = ctx.getContext().req
        const token = req.cookies['!']
        if (!token) return false
    }
}