import { createContext, useState } from "react";

export const UserContext = createContext({});


/*
    authUser = {
        id: ,
        firstName: ,
        lastName: ,
        displayName: ,
        email:, 
        reputation:,
        dateJoined:
        }

*/
export function UserContextProvider({ children }) {
    const [authUser, setAuthUser] = useState(null);

    return (
        <UserContext.Provider
            value={{
                authUser,
                setAuthUser,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}