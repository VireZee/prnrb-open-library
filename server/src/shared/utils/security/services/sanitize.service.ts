import { Injectable } from '@nestjs/common'
import { SANITIZE_REGEX } from '@shared/constants/regex.constant.js'

@Injectable()
export class SanitizeService {
    sanitize(id: string): string { return `${id.replace(SANITIZE_REGEX, '')}` }
    sanitizeRedisKey(name: string, key: string): string { return `${name}:${this.sanitize(key)}` }
}