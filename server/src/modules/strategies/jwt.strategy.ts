import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import type { PrismaService } from '@database/prisma.service.js'
import { RedisService } from '@shared/redis/redis.service.js'
import type { FormatterService } from '@shared/utils/formatter/formatter.service.js'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly redisService: RedisService,
        private readonly formatterService: FormatterService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([req => req.cookies['!']]),
            secretOrKey: process.env['SECRET_KEY']!,
        })
    }
    async validate() {
        
    }
}