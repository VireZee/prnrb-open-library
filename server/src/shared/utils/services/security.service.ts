import { Injectable } from '@nestjs/common'
import argon2 from 'argon2'
import HASH from '@shared/constants/hash.constant.js'
import REGEX from '@shared/constants/regex.constant.js'

@Injectable()
export class SecurityService {
    private generateSalt(): string {
        const ranges = [
            { s: 0x0020, e: 0x007E },
            { s: 0x00A1, e: 0x02FF },
            { s: 0x0370, e: 0x052F }
        ]
        const char: string[] = []
        for (const r of ranges) for (let i = r.s; i <= r.e; i++) char.push(String.fromCharCode(i))
        let result = ''
        for (let i = 0; i < 2048; i++) {
            const random = nodeCrypto.randomBytes(8)
            const decimal = random.readBigUInt64BE(0)
            const index = decimal * BigInt(char.length) / (1n << 64n)
            result += char[Number(index)]
        }
        return result
    }
    async hash(pass: string): Promise<string> {
        return await argon2.hash(pass + process.env['PEPPER'], {
            hashLength: HASH.HASH_LENGTH,
            timeCost: HASH.TIME_COST,
            memoryCost: HASH.MEMORY_COST,
            parallelism: HASH.PARALLELISM,
            type: 2,
            salt: Buffer.from(this.generateSalt(), 'utf-8')
        })
    }
    async verifyHash(pass: string, hashedPass: string): Promise<boolean> { return await argon2.verify(hashedPass, pass + process.env['PEPPER']) }
    sanitize(id: string): string { return `${id.replace(REGEX.SANITIZE_REGEX, '')}` }
    sanitizeRedisKey(name: string, key: string): string { return `${name}:${this.sanitize(key)}` }
}