import { Module } from '@nestjs/common'
import { UtilModule } from '@shared/utils/util.module.js'
import { HomeInterceptor } from '@common/interceptors/book/home.interceptor.js'
import { FetchInterceptor } from '@common/interceptors/book/fetch.interceptor.js'
import { AddRemovePipe } from '@common/pipes/book/addRemove.pipe.js'
import { BookResolver } from './book.resolver.js'
import { HomeService } from './services/home.service.js'
import { FetchService } from './services/fetch.service.js'
import { CollectionService } from './services/collection.service.js'
import { AddRemoveService } from './services/addRemove.service.js'

@Module({
    imports: [UtilModule],
    providers: [
        HomeInterceptor,
        FetchInterceptor,
        AddRemovePipe,
        BookResolver,
        HomeService,
        FetchService,
        CollectionService,
        AddRemoveService
    ]
})
export class BookModule {}