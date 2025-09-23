import { Injectable } from '@nestjs/common'

@Injectable()
export class FormatterService {
    formatName(name: string): string {
        const nameParts = name.split(' ')
        const initials = nameParts.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        return name = initials.join(' ')
    }
    formatUsername(username: string): string { return username.toLowerCase() }
    formatUser(user: { id: string, googleId: string, photo: Buffer, name: string, username: string, email: string, verified: boolean, api_key?: string }) {
        const { id, googleId, photo, name, username, email, verified, api_key } = user
        return {
            id: id.toString(),
            google: !!googleId,
            photo: Buffer.from(photo).toString('base64'),
            name,
            username,
            email,
            verified,
            ...(api_key && { api_key: Buffer.from(api_key).toString('hex') })
        }
    }
}