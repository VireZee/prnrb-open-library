import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo'
import { join } from 'path'
import { GraphqlFilter } from '@common/filters/graphql.filter.js'

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: join(dirname, '..', '.env')
        }),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: true,
            context: ({ req, res }: { req: Req, res: Res }) => ({ req, res })
        })
    ],
    providers: [
        GraphqlFilter
    ]
})
export class AppModule {}