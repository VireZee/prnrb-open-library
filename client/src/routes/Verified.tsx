import { Navigate, Outlet } from 'react-router-dom'
export default ({ verified }: { verified: boolean | null }) => {
    if (verified === null || verified === true) return <Navigate to='/' replace />
    return <Outlet />
}