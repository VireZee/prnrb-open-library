import { Injectable, type PipeTransform } from '@nestjs/common'
import { ApolloServerErrorCode } from '@apollo/server/errors'
import REGEX from '@shared/constants/regex.constant.js'

@Injectable()
export class ForgetPipe implements PipeTransform {
    transform(value: { email: string }): string {
        const { email } = value
        if (!email) throw { message: 'Email can\'t be empty!', code: ApolloServerErrorCode.BAD_USER_INPUT }
        if (!REGEX.EMAIL_REGEX.test(email)) throw { message: 'Email must be valid!', code: ApolloServerErrorCode.BAD_USER_INPUT }
        return email
    }
}