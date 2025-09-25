import { Module } from '@nestjs/common'
import { MailerModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter.js'
import { EmailService } from './email.service.js'

@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: process.env['MAIL_HOST'],
                port: Number(process.env['MAIL_PORT'])!,
                ignoreTLS: true,
                secure: false,
                auth: {
                    user: process.env['MAIL_USER'],
                    pass: process.env['MAIL_PASS']
                }
            },
            defaults: {
                from: `'No Reply' <${process.env['MAIL_FROM']}>`,
            },
            template: {
                dir: __dirname + '/templates',
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true
                }
            }
        })
    ],
    providers: [EmailService],
    exports: [EmailService]
})
export class EmailModule {}