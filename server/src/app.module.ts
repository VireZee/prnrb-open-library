import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo'
import { join } from 'path'
// import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: join(__dirname, '..', '.env')
        }),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver
        })
    ],
    // controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}