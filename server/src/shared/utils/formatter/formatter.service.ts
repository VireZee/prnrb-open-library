import { Injectable } from '@nestjs/common'

@Injectable()
export class FormatterService {
    formatName(name: string): string {
        const nameParts = name.split(' ')
        const initials = nameParts.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        return name = initials.join(' ')
    }
    formatUsername(username: string): string { return username.toLowerCase() }
}