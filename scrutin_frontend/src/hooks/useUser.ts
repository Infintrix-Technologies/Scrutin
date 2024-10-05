import { UserContext, UserContextProps } from "@/utils/auth/UserProvider";
import { useContext } from "react";

export const useUser = (): UserContextProps => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};