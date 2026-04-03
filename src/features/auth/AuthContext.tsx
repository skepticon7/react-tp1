import React, {createContext, useContext, useEffect, useReducer} from 'react'
import {authReducer , initialState } from './AuthReducer.ts';
import type {AuthAction , AuthState} from './AuthReducer.ts'
import {setAuthToken} from "../../api/axios.ts";


interface AuthContextType {
    state : AuthState;
    dispatch : React.Dispatch<AuthAction>
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children } : {children: React.ReactNode}) {
    const [state , dispatch] = useReducer(authReducer , initialState);

    useEffect(() => {
        setAuthToken(state.token);
    }, [state.token]);

    return (
        <AuthContext.Provider value={{state , dispatch}}>
            {children}
        </AuthContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth()  {
    const context = useContext(AuthContext);
    if(!context)
        throw new Error('Error using auth context')

    return context;
}
