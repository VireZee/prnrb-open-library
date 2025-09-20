import { Module } from '@nestjs/common'
import { SecurityService } from './security.service.js'

@Module({
    providers: [SecurityService],
    exports: [SecurityService]
})
export class SecurityModule {}