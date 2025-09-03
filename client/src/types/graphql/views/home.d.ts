import { BooksData } from '@type/components/views/home'
export type HomeQuery = {
    home: BooksData
}
export type FetchQuery = {
    fetch: {
        id: string,
        added: boolean
    }
}
export type AddMutation = {
    add: boolean
}