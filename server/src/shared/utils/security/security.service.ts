import { Injectable } from '@nestjs/common'
import { HashService } from './hash/hash.service.js'

@Injectable()
export class SecurityService {
    constructor(public readonly hashService: HashService) {}
}