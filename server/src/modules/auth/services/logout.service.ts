import { Injectable } from '@nestjs/common'

@Injectable()
export class LogoutService {
    async logout(): Promise<boolean> {

        return true
    }
}