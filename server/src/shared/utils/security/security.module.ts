import { Module } from '@nestjs/common'
import { SecurityService } from './security.service.js'
import { HashService } from './hash/hash.service.js'
import { SanitizeService } from './sanitize/sanitize.service.js'

@Module({
    providers:  [SecurityService, HashService, SanitizeService],
    exports: [SecurityService]
})
export class SecurityModule {}