import type { Request, Response } from 'express'
import type crypto from 'crypto'
import type { User as U } from './auth/user.d.ts'

declare global {
    namespace Express {
        interface User extends U {}
    }
    type Req = Request
    type Res = Response
    type ReqRes = { req: Req, res: Res }
    var nodeCrypto: typeof crypto
    var dirname: string
}
export {}