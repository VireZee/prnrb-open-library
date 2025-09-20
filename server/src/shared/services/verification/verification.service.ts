import { Injectable } from '@nestjs/common'

@Injectable()
export class VerificationService {
    generateCode(keyName: string, user: { _id: ObjectId | string, email: string }, isForget: boolean) {
        const key = sanitizeRedisKey(keyName, user._id)
        const randomString = nodeCrypto.randomBytes(64).toString('hex')
        const verificationCode = nodeCrypto.createHash('sha512').update(randomString).digest('hex')
        await Redis.HSET(key, 'code', verificationCode)
        await Redis.HEXPIRE(key, 'code', 300)
        if (isForget) return await resetPassword(user.email, verificationCode, user._id.toString())
        return await verifyEmail(user.email, verificationCode, user._id.toString())
    }
}