import { join } from 'path'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo'
import { DatabaseModule } from '@infrastructure/database/database.module.js'
import { CacheModule } from '@infrastructure/cache/cache.module.js'
import { WorkerModule } from '@common/utils/workers/worker.module.js'
import { AuthModule } from '@modules/auth/auth.module.js'
import { GraphqlFilter } from '@common/filters/graphql.filter.js'

@Module({
    imports: [
        ConfigModule.forRoot({ envFilePath: join(dirname, '..', '.env') }),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            path: '/gql',
            driver: ApolloDriver,
            autoSchemaFile: true,
            context: ({ req, res }: { req: Req, res: Res }) => ({ req, res })
        }),
        DatabaseModule,
        CacheModule,
        WorkerModule,
        AuthModule
    ],
    providers: [GraphqlFilter]
})
export class AppModule {}