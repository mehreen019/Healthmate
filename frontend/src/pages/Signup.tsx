import React, { useEffect } from 'react'
import { Box, Typography, Button } from '@mui/material'
import CustomizedInput from '../components/shared/CustomizedInput'
import { IoIosLogIn } from 'react-icons/io'
import {toast } from 'react-hot-toast';
import {useAuth} from '../context/AuthContext';
import { useNavigate} from 'react-router-dom';
const Signup = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    const data = new FormData(e.currentTarget)
    const email = data.get("email") as string; //we get by name
    const password = data.get("password") as string;
    const name = data.get("name") as string;
    try {
      toast.loading("Signing In", {id:"login"});
      await auth?.signup(name , email , password);
      toast.loading("Signed up Successfuly", {id:"signup"});

    } catch (error) {
      console.log(error);
      toast.loading("Signing up Failed", {id:"signup"});

    }

    console.log(email + " and " + password);
  }
    useEffect(()=>{
      if(auth?.user)
        {
          toast.success("chat page");
          return navigate("/chat");
        }

    },[auth]);
  return (
      <Box
        display={"flex"}
        flex={{ xs: 1, md: 0.5 }}
        justifyContent={"center"}
        alignItems={"center"}
        padding={2}
        ml={"auto"}
        mt={16}
      >
        <form onSubmit={handleSubmit} >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h4"
              textAlign="center"
              padding={2}
              fontWeight={600}
            >
              Signup
            </Typography>
            <CustomizedInput type="text" name="name" label="Name" />
            <CustomizedInput type="email" name="email" label="Email" />
            <CustomizedInput type="password" name="password" label="Password" />
            <Button
              type="submit"
              sx={{
                px: 2,
                py: 1,
                mt: 2,
                width: "400px",
                borderRadius: 2,
                bgcolor: "#00fffc",
                ":hover": {
                  bgcolor: "white",
                  color: "black",
                },
              }}
              endIcon={<IoIosLogIn />}
            >
              Signup
            </Button>
          </Box>
        </form>
      </Box>
  )
}

export default Signup
