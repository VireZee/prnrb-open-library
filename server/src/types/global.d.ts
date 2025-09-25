import type { Request, Response } from 'express'
import type crypto from 'crypto'

declare global {
    namespace Express {
        interface Request {
            token?: string | null
        }
    }
    type Req = Request
    type Res = Response
    var nodeCrypto: typeof crypto
    var dirname: string
}
export {}