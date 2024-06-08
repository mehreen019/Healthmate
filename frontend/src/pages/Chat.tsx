import React, { useRef, useState } from 'react';
import {Box, Avatar, Typography, IconButton , Button} from '@mui/material';
import {useAuth} from "../context/AuthContext";
import {red} from "@mui/material/colors";
import ChatItem from '../components/chat/ChatItem';
import {IoMdSend} from 'react-icons/io';
import { sendChatRequest } from '../helpers/api-communicator';

type Message = {
  role: "user" | "assistant";
  content: string;
};

const Chat = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  
  const auth = useAuth();

  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  const handleSubmit = async () => {
    const content = inputRef.current?.value as string;
    if (inputRef && inputRef.current) {
      inputRef.current.value = "";
    }
    const newMessage: Message = { role: "user", content };
    setChatMessages((prev) => [...prev, newMessage]);
    const chatData = await sendChatRequest(content);
    setChatMessages([...chatData.chats]);
    
  };
  return <Box sx = {{
    display: "flex",
    flex: 1,
    width: "100%",
    height: "100%",
    mt: 3,
    gap: 3,
  }} >
     <Box
        sx={{
          display: { md: "flex", xs: "none", sm: "none" },
          flex: 0.2,
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "60vh",
            bgcolor: "rgb(17,29,39)",
            borderRadius: 5,
            flexDirection: "column",
            mx: 3,
          }}
        >

          <Avatar
            sx={{
              mx: "auto",
              my: 2,
              bgcolor: "white",
              color: "black",
              fontWeight: 700,
            }}
          >
            {auth?.user?.name[0]}
            {auth?.user?.name.split(" ")[1][0]}
          </Avatar>
          <Typography
          sx={{mx : "auto",
            fontFamily : "work sans"
           }}
          >
            You are talking to a chatbot.

          </Typography>

          <Typography
          sx={{mx : "auto",
            fontFamily : "work sans",
            my : 4, p :3
           }}
          >
            You can ask your medical queries here.

          </Typography>

          <Button
          sx={{
            width:"200px", my : "auto", color : "white", 
            fontWeight : "700",
            borderRadius : 3,
            mx : "auto",
            bgcolor : red[300],
            ":hover" :{
                bgcolor:red.A400,
            },
            
          }}> Clear COnversation

          </Button>
        </Box>
      </Box>
      <Box sx = {{
        display : "flex",
        flex : {md :0.8, xs: 1, sm : 1},
        flexDirection : "column"
      }}>
        <Typography sx={{
          textAlign : "center",
          fontSize: "40px",
          color : "white",
         mb : 2,
         mx : "auto",
         fontWeight : "600"
        }}>
          Model - GPT 3.5 Turbo

        </Typography>
        <Box sx={{width : "100%",
          height :"60vh",
          borderRadius : 3,
          mx : "auto",
          display: "flex",
          flexDirection : "column",
          overflow : "scroll",
          overflowX:"hidden",
          scrollBehavior:"smooth",
          overflowY:"auto"
        }}>
          {chatMessages.map((chat,index) =>(
            <ChatItem content={
              chat.content
            }
            role={
              chat.role
            } 
            
            key={index}/>
          ))}

        </Box>
        <Box>
          <div style={{
            width : "100%",
            padding : "20px",
            borderRadius : 8,
            backgroundColor : "rgb(17, 27, 39)",
            display : "flex",
            marginRight:"auto",


          }}>
            <input 
            ref={inputRef}
            type = "text"
            style={{
              width : "100%",
              backgroundColor : "transparent",
              padding:"10px",
              border : "none",
              outline:"none",
              color:"white",
              fontSize:"20px",
            }}/>
            <IconButton onClick={handleSubmit} sx={{ color: "white", mx: 1 }}>
            <IoMdSend />
          </IconButton>
          </div>
        </Box>
      </Box>
  </Box>
}

export default Chat
