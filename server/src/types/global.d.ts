import type { Request, Response } from 'express'
import type crypto from 'crypto'

declare global {
    type Req = Request
    type Res = Response
    type ReqRes = { req: Req, res: Res }
    var nodeCrypto: typeof crypto
    var dirname: string
}
export {}