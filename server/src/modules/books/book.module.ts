import { Module } from '@nestjs/common'
import { UtilModule } from '@shared/utils/util.module.js'
import { HomeInterceptor } from '@common/interceptors/book/home.interceptor.js'
import { HomePipe } from '@common/pipes/book/home.pipe.js'
import { FetchInterceptor } from '@common/interceptors/book/fetch.interceptor.js'
import { BookResolver } from './book.resolver.js'
import { HomeService } from './services/home.service.js'
import { FetchService } from './services/fetch.service.js'

@Module({
    imports: [UtilModule],
    providers: [
        HomeInterceptor,
        HomePipe,
        FetchInterceptor,
        BookResolver,
        HomeService,
        FetchService
    ]
})
export class BookModule {}