import { Injectable } from '@nestjs/common'
import { RedisService } from '@infrastructure/redis/services/redis.service.js'
import { RetryService } from './retry.service.js'

@Injectable()
export class QueueService {
    private pending: string[] = []
    private processing = false
    constructor(
        private readonly redisService: RedisService,
        private readonly retryService: RetryService
    ) {}
    queue(key: string): void {
        this.pending.push(key)
        this.republish()
    }
    private async republish(): Promise<void> {
        if (this.processing) return
        this.processing = true
        while (this.pending.length > 0) {
            const updates = this.pending.splice(0, this.pending.length)
            try {
                for (const update of updates) await this.retryService.retry(() => this.redisService.pub.publish('collection:update', update), {})
            } catch {
                this.pending.unshift(...updates)
                break
            }
        }
        this.processing = false
        if (this.pending.length > 0) this.republish()
    }
}