import type { Request, Response } from '@nestjs/common'
import type crypto from 'crypto'

declare global {
    type Req = Request
    type Res = Response
    var nodeCrypto: typeof crypto
}
export {}