import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { FullPageLoader } from '@/layouts/Loaders'
import { UserContext } from './UserProvider'
import MainLayout from '@/layouts/MainLayout'

export const ProtectedRoute = () => {

    const { currentUser, isLoading } = useContext(UserContext)

    if (isLoading) {
        return <FullPageLoader />
    }
    // else if (!currentUser || currentUser === 'Guest') {
    //     return <Navigate to="/login" />
    // }
    return (
        <MainLayout>
            <Outlet />
        </MainLayout>
    )
}