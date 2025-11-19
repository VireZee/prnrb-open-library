import { Module } from '@nestjs/common'
import { AuthResolver } from './auth.resolver.js'
import { RegisterPipe } from '@common/pipes/register.pipe.js'
import { RegisterService } from './services/register.service.js'

@Module({
    providers: [
        AuthResolver,
        RegisterPipe,
        RegisterService
    ]
})
export class AuthModule {}