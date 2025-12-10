import { Injectable } from '@nestjs/common'
import type { Settings } from '../dto/settings.dto.js'
import type { User } from '@type/user.js'

@Injectable()
export class SettingService {
    constructor(){}
    async settings(args: Settings, res: Res, user:User) {
        const { name, username, email, pass } = args
    }
}