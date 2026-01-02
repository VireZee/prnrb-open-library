import { join } from 'path'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo'
import { DatabaseModule } from '@infrastructure/database/database.module.js'
import { RedisModule } from '@infrastructure/redis/redis.module.js'
import { WorkerModule } from '@common/workers/worker.module.js'
import { AuthModule } from '@modules/auth/auth.module.js'
import { BookModule } from '@modules/books/book.module.js'
import { ApiModule } from '@modules/api/api.module.js'
import { GraphqlFilter, HttpExceptionFilter } from '@common/filters/exception.filter.js'

@Module({
    imports: [
        ConfigModule.forRoot({ envFilePath: join(dirname, '..', '.env') }),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            path: '/gql',
            driver: ApolloDriver,
            autoSchemaFile: true,
            context: ({ req, res }: ReqRes) => ({ req, res })
        }),
        DatabaseModule,
        RedisModule,
        WorkerModule,
        AuthModule,
        BookModule,
        ApiModule
    ],
    providers: [GraphqlFilter, HttpExceptionFilter]
})
export class AppModule {}