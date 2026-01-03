import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common'
import { GoogleAuthGuard } from '@common/guards/google.guard.js'

@Controller('auth/google')
export class GoogleController {
    @Get('register')
    @UseGuards(GoogleAuthGuard)
    register() {
    }

    @Get('login')
    @UseGuards(GoogleAuthGuard)
    login() {
    }

    @Get('connect')
    @UseGuards(GoogleAuthGuard)
    connect() {
    }
}
