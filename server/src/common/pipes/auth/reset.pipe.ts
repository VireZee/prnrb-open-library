import { Injectable, type PipeTransform } from '@nestjs/common'
import { ApolloServerErrorCode } from '@apollo/server/errors'
import type { Reset } from '@modules/auth/dto/reset.dto.js'

@Injectable()
export class ResetPipe implements PipeTransform {
    transform(value: Reset): Reset {
        const { pass, rePass, show } = value
        if (!pass) throw { message: 'Password can\'t be empty!', code: ApolloServerErrorCode.BAD_USER_INPUT }
        if (!show && pass !== rePass) throw { message: 'Password do not match!', code: ApolloServerErrorCode.BAD_USER_INPUT }
        return value
    }
}