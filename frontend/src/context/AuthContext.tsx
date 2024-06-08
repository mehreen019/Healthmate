import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { loginUser, checkAuthStatus, logoutUser,signupUser } from "../helpers/api-communicator";


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
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // fetch if the user's cookies are valid then skip login
        async function checkStatus() {
          const data = await checkAuthStatus();
          if (data) {
            setUser({ email: data.email, name: data.name });
            setIsLoggedIn(true);
          }
        }
        checkStatus();
      }, []);

    const login = async (email:string, password:string)=>{
        const data = await loginUser(email, password);
        if(data){
            setUser({email: data.email, name : data.name});
            setIsLoggedIn(true);
            window.location.reload();
        }
    };
    const signup = async (name: string, email: string, password: string) => {
        const data = await signupUser(name, email, password);
        if (data) {
          setUser({ email: data.email, name: data.name });
          setIsLoggedIn(true);
        }
      };
    const logout = async ()=>{
        await logoutUser();
        setIsLoggedIn(false);
        setUser(null);
    };

    const value={
        user, //state
        isLoggedIn, //state
        login, //async func
        signup, //async func 
        logout, //async func
    };

    return <AuthContext.Provider value={value}> {children} </AuthContext.Provider>

}
export const useAuth = () => useContext(AuthContext);
export const getAuthContext = ()=> useContext(AuthContext); //context used by the users. kinda like a getter function