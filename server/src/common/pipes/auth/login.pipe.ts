import { Injectable, type PipeTransform } from '@nestjs/common'
import type { Login } from '@modules/auth/dto/login.dto.js'
import ERROR from '@common/constants/error.constant.js'

@Injectable()
export class LoginPipe implements PipeTransform {
    transform(value: Login): Login {
        const { emailOrUsername, pass } = value
        if (!emailOrUsername || !pass) throw { message: 'Invalid login credentials!', code: ERROR.INVALID_CREDENTIALS }
        return {
            ...value,
            emailOrUsername: emailOrUsername.toLowerCase()
        }
    }
}