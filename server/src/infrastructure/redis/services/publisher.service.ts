import { Injectable } from '@nestjs/common'
import { QueueService } from '@common/workers/services/queue.service.js'

@Injectable()
export class PublisherService {
    constructor(private readonly queueService: QueueService) {}
    publish(channel: string, message: string): void { this.queueService.queue(message, channel) }
}