import './global.js'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module.js'
import cp from 'cookie-parser'
import { GraphqlFilter } from '@common/filters/graphql.filter.js'

(async () => {
  const app = await NestFactory.create(AppModule)
  app.enableCors({ origin: `http://${process.env['DOMAIN']}:${process.env['CLIENT_PORT']}`, credentials: true })
  app.use(cp())
  app.useGlobalFilters(app.get(GraphqlFilter))
  await app.listen(process.env['PORT']!)
})()