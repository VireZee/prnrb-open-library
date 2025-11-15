import './global.js'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module.js'
import cp from 'cookie-parser'

(async () => {
  const app = await NestFactory.create(AppModule)
  app.enableCors({ origin: `http://${process.env['DOMAIN']}:${process.env['CLIENT_PORT']}`, credentials: true })
  app.use(cp())
  await app.listen(process.env['PORT']!)
})()