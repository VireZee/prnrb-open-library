import { Global, Module } from '@nestjs/common'
import { RetryService } from './services/retry.service.js'
import { QueueService } from './services/queue.service.js'

@Global()
@Module({
    providers: [RetryService, QueueService],
    exports: [RetryService, QueueService]
})
export class WorkerModule {}