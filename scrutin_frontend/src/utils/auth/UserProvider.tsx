import { useFrappeAuth } from 'frappe-react-sdk'
import { FC, PropsWithChildren } from 'react'
import { createContext } from 'react'
import { Navigate } from 'react-router-dom'

export interface UserContextProps {
    isLoading: boolean,
    currentUser: string,
    logout: () => Promise<void>,
    updateCurrentUser: VoidFunction,
}

export const UserContext = createContext<UserContextProps>({
    currentUser: '',
    isLoading: false,
    logout: () => Promise.resolve(),
    updateCurrentUser: () => { },
})

export const UserProvider: FC<PropsWithChildren> = ({ children }) => {

    // const { mutate } = useSWRConfig()
    const { logout, currentUser, updateCurrentUser, isLoading } = useFrappeAuth()



    const handleLogout = async () => {
        // localStorage.removeItem('ravenLastChannel')
        // localStorage.removeItem('app-cache')
        return logout()
            // .then(() => {
            //     //Clear cache on logout
            //     return mutate((key) => {
            //         if (key === 'raven.api.login.get_context') {
            //             return false
            //         }
            //         return true
            //     }, undefined, false)
            // })
            .then(() => {
                //Reload the page so that the boot info is fetched again
                const URL = import.meta.env.VITE_BASE_NAME ? `${import.meta.env.VITE_BASE_NAME}` : ``
                if (URL) {
                    window.location.replace(`/${URL}/login`)
                } else {
                    window.location.replace('/login')
                }

                // window.location.reload()
            })
    }

    // if (!isLoading){
    //     return <div>Loading...</div>
    // }

    // if (!currentUser){
    //     return <Navigate to={`/auth/login`}/>
    // }

    return (
        <UserContext.Provider value={{ isLoading, updateCurrentUser, logout: handleLogout, currentUser: currentUser ?? "" }}>
            {children}
        </UserContext.Provider>
    )
}

