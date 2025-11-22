import { Catch } from '@nestjs/common'
import type { GqlExceptionFilter } from '@nestjs/graphql'
import type { MiscService } from '@shared/utils/misc/misc.service.js'

@Catch()
export class GraphqlFilter implements GqlExceptionFilter {
    constructor(private readonly miscService: MiscService) { }
    catch(exception: { code: string, errors?: Record<string, string> } | Error) {
        if (typeof exception === 'object' && 'code' in exception) {
            const { code, errors } = exception
            return errors
                ? this.miscService.graphqlError(code, errors)
                : this.miscService.graphqlError(code)
        }
        return this.miscService.graphqlError(exception.message)
    }
}