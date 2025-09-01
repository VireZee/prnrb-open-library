import type { FC } from 'react'

const NoInternet: FC = () => {
    return (
        <div className="mt-16">
            <h1 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl">No Internet Connection</h1>
        </div>
    )
}
export default NoInternet