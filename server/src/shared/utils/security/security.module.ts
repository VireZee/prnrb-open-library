import { Module } from '@nestjs/common'
import { SecurityService } from './services/security.service.js'
import { HashService } from './services/hash.service.js'
import { SanitizeService } from './services/sanitize.service.js'

@Module({
    providers:  [SecurityService, HashService, SanitizeService],
    exports: [SecurityService]
})
export class SecurityModule {}