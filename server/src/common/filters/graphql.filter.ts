import { Catch } from '@nestjs/common'
import type { GqlExceptionFilter } from '@nestjs/graphql'
import { GraphQLError } from 'graphql'

@Catch()
export class GraphqlFilter implements GqlExceptionFilter {
    catch(exception: { code: string, errors?: Record<string, string> } | Error): never {
        if (typeof exception === 'object' && 'code' in exception) {
            const { code, errors } = exception
            if (errors) throw new GraphQLError(code, { extensions: { errors } })
            throw new GraphQLError(code)
        }
        throw new GraphQLError(exception.message)
    }
}