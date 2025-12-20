import { Injectable } from '@nestjs/common'
import type { User } from '@type/auth/user.js'
import type Collection from '@type/book/collection.js'

@Injectable()
export class FormatterService {
    formatName(name: string): string {
        const nameParts = name.split(' ')
        const initials = nameParts.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        return name = initials.join(' ')
    }
    formatUsername(username: string): string { return username.toLowerCase() }
    formatUser(user: { id: string, googleId: string | null, photo: Uint8Array, name: string, username: string, email: string, verified: boolean, api_key?: Uint8Array | null }): User {
        const { id, googleId, photo, name, username, email, verified, api_key } = user
        return {
            id,
            google: !!googleId,
            photo: Buffer.from(photo).toString('base64'),
            name,
            username,
            email,
            verified,
            ...(api_key && { api_key: Buffer.from(api_key).toString('hex') })
        }
    }
    formatBooksMap(books: Collection[]): Collection[] {
        return books.map(book => ({
            author_key: book.author_key,
            cover_edition_key: book.cover_edition_key,
            cover_i: book.cover_i,
            title: book.title,
            author_name: book.author_name
        }))
    }
    formatBooksFind(books: Collection[], author_key: string[], cover_edition_key: string, cover_i: number): Collection | undefined {
        return books.find(book =>
            book.author_key.length === author_key.length &&
            book.author_key.every((val, i) => val === author_key[i]) &&
            book.cover_edition_key === cover_edition_key &&
            book.cover_i === cover_i
        )
    }
    formatTimeLeft(seconds: number): string {
        const h = Math.floor(seconds / 3600)
        const m = Math.floor((seconds % 3600) / 60)
        const s = seconds % 60
        return h > 0 ? `${h}h ${m}m ${s}s` : m > 0 ? `${m}m ${s}s` : `${s}s`
    }
}