import { Injectable } from '@nestjs/common'
import argon2 from 'argon2'

@Injectable()
export class SecurityService {
    async hash(pass: string) {
        const generateSalt = () => {
            const ranges = [
                { s: 0x0020, e: 0x007E },
                { s: 0x00A1, e: 0x02FF },
                { s: 0x0370, e: 0x052F }
            ]
            const char: string[] = []
            for (const r of ranges) for (let i = r.s; i <= r.e; i++) char.push(String.fromCharCode(i))
            let result = ''
            for (let i = 0; i < 512; i++) {
                const shuffle = Math.floor(Math.random() * char.length)
                result += char[shuffle]
            }
            return result
        }
        return await argon2.hash(pass + process.env['PEPPER'], {
            hashLength: 64,
            timeCost: 6,
            memoryCost: 64 * 1024,
            parallelism: 4,
            type: 2,
            salt: Buffer.from(generateSalt(), 'utf-8')
        })
    }
    async verifyHash(pass: string, hashedPass: string) { return await argon2.verify(hashedPass, pass + process.env['PEPPER']) }
}