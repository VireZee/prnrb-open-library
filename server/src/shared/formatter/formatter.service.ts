import { Injectable } from '@nestjs/common'

@Injectable()
export class FormatterService {
    formatName(name: string) {
        const nameParts = name.split(' ')
        const initials = nameParts.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        return name = initials.join(' ')
    }
    formatUsername(username: string) { return username.toLowerCase() }
}