import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common'
import { GoogleAuthGuard } from '@common/guards/google.guard.js'

@Controller('auth/google')
export class GoogleController {
    @Get('register')
    @UseGuards(GoogleAuthGuard)
    _(): void { }
    @Get('login')
    @UseGuards(GoogleAuthGuard)
    __(): void { }
    @Get('connect')
    @UseGuards(GoogleAuthGuard)
    ___(): void { }
    @Get('callback')
    async ____(@Req() req: Req, @Res() res: Res) {
        const user = req.user
        if (!user) {
            return res.send(`
                <script>
                    window.opener.postMessage({ message: '${info.message}' }, 'http://${process.env['DOMAIN']}:${process.env['CLIENT_PORT']}')
                    window.close()
                </script>
            `)
        }
        if (err) {
            return res.send(`
                <script>
                    window.opener.postMessage({ message: '${err}' }, 'http://${process.env['DOMAIN']}:${process.env['CLIENT_PORT']}')
                    window.close()
                </script>
            `)
        }
    }
}