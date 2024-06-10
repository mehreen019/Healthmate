
import axios from "axios";
export const loginUser = async (email : string, password : string) => {
    const res = await axios.post("/user/login", {email, password});
    if(res.status != 200)
    {
        throw new Error("Unable to login");
    }
    const data = await res.data;
    return data;
};

export const checkAuthStatus = async () => {
    const res = await axios.get("/user/auth-status");
    if (res.status !== 200) {
      throw new Error("Unable to authenticate");
    }
    const data = await res.data;
    return data;
  };

  export const sendChatRequest = async (message: string) => {
    console.log("reached send chat in api comm")
   const res = await axios.post("/chat/new", { message });
    //const res = "hi";
    if (res.status !== 200) {
      throw new Error("Unable to send chat");
    }
    const data = await res.data;
    return data;
    //return { chats: {role: "user", content:"ok chat"}, diagnosis: "ok diagnosis" };
    
  };
  export const getUserChats = async () => {
    const res = await axios.get("/chat/all-chats");
     //const res = "hi";
     if (res.status !== 200) {
       throw new Error("Unable to send chat");
     }
     const data = await res.data;
     //return "hiii , how can";
     return data;
   };

   export const deleteUserChats = async () => {
    const res = await axios.delete("/chat/delete");
     //const res = "hi";
     if (res.status !== 200) {
       throw new Error("Unable to delete chat");
       console.log("Unable to delete chats");
     }
     const data = await res.data;
     //return "hiii , how can";
     return data;
   };

   export const logoutUser = async () => {
    const res = await axios.get("/user/logout");
     //const res = "hi";
     if (res.status !== 200) {
       throw new Error("Unable to log out ");
       console.log("Unable to delete chats");
     }
     const data = await res.data;
     //return "hiii , how can";
     return data;
   };


   export const signupUser = async (
    name: string,
    email: string,
    password: string
  ) => {
    const res = await axios.post("/user/signup", { name, email, password });
    if (res.status !== 201) {
      throw new Error("Unable to Signup");
    }
    const data = await res.data;
    return data;
  };
  