import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type User = {
    name: string;
    email: string;
};

type UserAuth = {
    user: User|null;
    isLoggedIn: boolean;
    login: (email:string, password:string) => Promise<void>;
    signup: (name:string ,email:string, password:string) => Promise<void>;
    logout: ()=>Promise<void>
}

const AuthContext = createContext<UserAuth | null>(null);
export const AuthProvider = ({children} : {children: ReactNode}) =>{
    const [user, setUser] = useState<User|null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    useEffect(()=>{}, []);

    const login = async (email:string, password:string)=>{};
    const signup = async (name:string ,email:string, password:string)=>{};
    const logout = async ()=>{};

    const value={
        user, //state
        isLoggedIn, //state
        login, //async func
        signup, //async func 
        logout, //async func
    };

    return <AuthContext.Provider value={value}> {children} </AuthContext.Provider>

}

export const getAuthContext = ()=> useContext(AuthContext); //context used by the users. kinda like a getter function