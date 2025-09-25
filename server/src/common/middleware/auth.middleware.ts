import { Injectable, type NestMiddleware } from '@nestjs/common'
import type { NextFunction } from 'express'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    async use(req: Req, next: NextFunction): Promise<void> {
        const token = req.cookies['!']
        req['token'] = token ?? null
        next()
    }
}