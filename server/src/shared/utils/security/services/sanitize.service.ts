import { Injectable } from '@nestjs/common'

@Injectable()
export class SanitizeService {
    sanitize(id: string): string { return `${id.replace(/[^a-zA-Z0-9]/g, '')}` }
    sanitizeRedisKey(name: string, key: string): string { return `${name}:${this.sanitize(key)}` }
}