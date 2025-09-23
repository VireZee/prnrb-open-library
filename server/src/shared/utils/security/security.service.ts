import { Injectable } from '@nestjs/common'
import type { HashService } from './hash/hash.service.js'
import type { SanitizeService } from './sanitize/sanitize.service.js'
import jwt from 'jsonwebtoken'

@Injectable()
export class SecurityService {
    constructor(
        readonly hashService: HashService,
        readonly sanitizeService: SanitizeService
    ) {}
    jwtSign(id: string): string { return jwt.sign({ id }, process.env['SECRET_KEY']!, { algorithm: 'HS512', expiresIn: '30d' }) }
}