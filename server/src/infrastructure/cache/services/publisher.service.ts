import { Injectable } from '@nestjs/common'
import { RedisService } from './redis.service.js'

@Injectable()
export class PublisherService {
    constructor(private readonly redisService: RedisService) {}
    async publish(channel: string, message: string): Promise<void> {
        await this.redisService.pub.PUBLISH(channel, message)
    }
}