import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo'
import { join } from 'path'
import { AppService } from './app.service.js'

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: join(dirname, '..', '.env')
        }),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), 'src/schema.gql')
        })
    ],
    providers: [AppService]
})
export class AppModule {}