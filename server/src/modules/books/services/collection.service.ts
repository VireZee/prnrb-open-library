import { Injectable } from '@nestjs/common'
import type { Search } from '../dto/search.dto.js'
import type { User } from '@type/auth/user.d.ts'

@Injectable()
export class CollectionService {
    constructor() { }
    async collection(args: Search, user: User) {
        // const { search, page } = args
        
    }
}