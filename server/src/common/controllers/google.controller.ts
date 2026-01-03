import { Controller, Get, UseGuards } from '@nestjs/common'
import { GoogleAuthGuard } from '@common/guards/google.guard.js'

@Controller('auth/google')
export class GoogleController {
    @Get('register')
    @UseGuards(GoogleAuthGuard)
    _(): void {}
    @Get('login')
    @UseGuards(GoogleAuthGuard)
    __(): void {}
    @Get('connect')
    @UseGuards(GoogleAuthGuard)
    ___(): void {}
}