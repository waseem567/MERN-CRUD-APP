import { createContext } from 'react';
export const AuthContext = createContext({
    isLoggedIn:false,
    login:()=>{},
    logout:()=>{},
    userId: null,
    token: null,
    onSearchProduct:()=>{}, 
    name: ""
});