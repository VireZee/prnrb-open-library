import type { Request, Response } from 'express'
import type crypto from 'crypto'

declare global {
    type Req = Request
    type Res = Response
    var nodeCrypto: typeof crypto
}
export {}