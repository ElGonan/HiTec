/*  Get the context of the user, to avoid many
    calls to the API.
*/

import { createContext, useContext } from "react";

export const userData = createContext<User | undefined>(undefined);

export const useUserContext = () => {

    // useContext, it will be type User.
    const user = useContext(userData);

    // However if for some reason we don't have a user, let's throw an error
    if (user === undefined) {
        throw new Error("useUserContext can only be called with the userData ");
    }

    return user;

} 