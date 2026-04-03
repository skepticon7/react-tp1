export interface User {
    id : string;
    email : string;
    name : string;
    token : string;
}


export interface AuthState {
    user : User | null;
    loading : boolean;
    error : string | null;
    token : string | null;
}


export type AuthAction = {type : 'LOGIN_START'} | { type: 'LOGIN_SUCCESS'; payload: {user : User , token : string} }
    | { type: 'LOGIN_FAILURE'; payload: string }
    | { type: 'LOGOUT' };

export const initialState : AuthState = {
    user : null,
    loading : false,
    error : null,
    token : null
}


export  function authReducer(state : AuthState , action : AuthAction) : AuthState {
    switch (action.type) {
        case 'LOGIN_START':
            return {user : null , loading : true , error : null , token : null}
        case 'LOGIN_SUCCESS':
            return {user : action.payload.user , loading : false , error : null , token : action.payload.token || null}
        case 'LOGIN_FAILURE':
            return {user : null , loading : false , error : null , token : null}
        case 'LOGOUT':
            return {user : null , loading : false , error : null , token : null}
        default : return state;
    }
}


