import { useEffect, type FC } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, ApolloError } from '@apollo/client'
import FETCH from '@features/book/queries/Collection'
import REMOVE from '@features/book/mutations/Remove'
import { useSelector, useDispatch } from 'react-redux'
import { setOnline, setLoad, setBooks, setTotalPages } from '@store/slices/views/collection'
import type { RootState } from '@store/store'
import Load from '@components/common/Load'
import NoInternet from '@components/common/NoInternet'
import NoBooks from '@components/common/NoBooks'
import type { CollectionProps, CollectionData } from '@type/components/collection'
import type Books from '@type/redux/book/books'

const Collection: FC<CollectionProps> = ({ search }) => {
    const { query, page } = useParams()
    const pg = Number(page) || 1
    const { refetch } = useQuery(FETCH, { skip: true })
    const [remove] = useMutation(REMOVE)
    const dispatch = useDispatch()
    const collectionState = useSelector((state: RootState) => state.collection)
    const { online, load, books, totalPages } = collectionState
    useEffect(() => {
        const handleOnline = () => dispatch(setOnline(navigator.onLine))
        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOnline)
        fetchCollection()
        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOnline)
        }
    }, [online, search])
    const collectionData = (data: CollectionData) => {
        const { found, collection, totalCollection } = data
        if (found === 0) dispatch(setBooks([]))
        else {
            dispatch(setBooks(collection))
            dispatch(setTotalPages(Math.ceil(totalCollection / 9)))
        }
    }
    const fetchCollection = async () => {
        try {
            dispatch(setLoad(true))
            const { data } = await refetch({
                search: search && search.trim()
                    ? search
                    : query && query.trim()
                        ? query.replace(/\++/g, ' ')
                        : '',
                page: pg
            })
            if (data.collection) collectionData(data.collection)
        } catch (err) {
            if (err instanceof ApolloError) alert('Fetch Error: ' + err.message)
            else alert('Fetch Error: An unexpected error occurred.')
        } finally {
            dispatch(setLoad(false))
        }
    }
    const removeCollection = async (author_key: string[], cover_edition_key: string, cover_i: number) => {
        try {
            const { data } = await remove({ variables: { author_key, cover_edition_key, cover_i } })
            if (data.remove) fetchCollection()
        } catch (err) {
            if (err instanceof ApolloError) alert(err.message)
            else alert('An unexpected error occurred.')
        }
    }
    const pageNumbers = () => {
        const pages = []
        const addPages = (s: number, e: number) => {
            for (let i = s; i <= e; i++) pages.push(i)
        }
        if (totalPages <= 9) addPages(1, totalPages)
        else if (search || pg <= 6) {
            addPages(1, 7)
            pages.push('...', totalPages)
        } else if (pg <= totalPages - 4) {
            pages.push(1, '...')
            addPages(pg - 3, pg + 1)
            pages.push('...', totalPages)
        } else if (pg <= totalPages - 3) {
            pages.push(1, '...')
            addPages(pg - 3, pg + 1)
            pages.push(totalPages - 1, totalPages)
        } else if (pg <= totalPages - 2) {
            pages.push(1, '...')
            addPages(pg - 4, pg + 1)
            pages.push(totalPages)
        } else if (pg <= totalPages - 1) {
            pages.push(1, '...')
            addPages(pg - 5, pg + 1)
        } else {
            pages.push(1, '...')
            addPages(pg - 6, pg)
        }
        return (
            <>
                {pages.map((page, idx) => (
                    <span
                        key={idx}
                        className={`cursor-pointer my-10 px-3 py-1 rounded-full ${page === pg ? 'bg-blue-500 text-white' : ''}`}
                    >
                        <a href={
                            search?.trim()
                                ? `/collection/${search.replace(/\s+/g, '+')}/${page}`
                                : query
                                    ? `/collection/${query}/${page}`
                                    : `/collection/${page}`
                        }>
                            {page}
                        </a>
                    </span >
                ))}
            </>
        )
    }
    return (
        <>
            {load ? (
                <Load />
            ) : (
                <>
                    {online ? (
                        <>
                            {books.length === 0 ? (
                                <NoBooks />
                            ) : (
                                <>
                                    <div className="mt-[12rem] sm:mt-[6rem] md:mt-[7rem] lg:mt-[8rem] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-6 lg:px-8">
                                        {books.map((book: Books, idx: number) => (
                                            <div key={idx} className="flex flex-col sm:flex-row max-w-sm sm:max-w-md lg:max-w-lg mx-auto p-6 border border-gray-400 shadow-[0px_4px_20px_rgba(0,0,0,0.6)] rounded-lg bg-white text-black">
                                                <img src={`http://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`}
                                                    alt={book.title}
                                                    className="w-full sm:w-[210px] h-[300px] object-cover border-2 border-gray-400" />
                                                <div className="ml-4">
                                                    <h1 className="text-center font-black text-xl mb-5">{book.title}</h1>
                                                    <h2 className="text-sm mb-2">Author(s): {book.author_name.join(', ')}</h2>
                                                    <label className="flex items-center space-x-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={true}
                                                            onChange={() => { removeCollection(book.author_key, book.cover_edition_key, book.cover_i) }}
                                                        />
                                                        <span>Added to Collection</span>
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-center">
                                        {pageNumbers()}
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <NoInternet />
                    )}
                </>
            )}
        </>
    )
}
export default Collection