import { Injectable } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'

@Injectable()
export class EmailService {
    constructor(private readonly mailerService: MailerService) {}
    async verifyEmail(email: string, verificationCode: string, id: string): Promise<void> {
        await this.mailerService.sendMail({
            to: email,
            from: process.env['MAIL_FROM']!,
            subject: 'Verify Your Email',
            template: './verify',
            context: {
                verificationCode,
                link: `http://${process.env['DOMAIN']}:${process.env['PORT']}/verify/${id}/${verificationCode}`
            }
        })
    }
    async resetPassword(email: string, verificationCode: string, id: string): Promise<void> {
        await this.mailerService.sendMail({
            to: email,
            from: process.env['MAIL_FROM']!,
            subject: 'Reset Your Password',
            template: './reset',
            context: {
                link: `http://${process.env['DOMAIN']}:${process.env['CLIENT_PORT']}/reset/${id}/${verificationCode}`
            }
        })
    }
}