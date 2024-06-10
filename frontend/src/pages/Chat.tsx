import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {Box, Avatar,Typography, Button, IconButton } from '@mui/material';
import {useAuth} from "../context/AuthContext";
import red from "@mui/material/colors/red";
import ChatItem from '../components/chat/ChatItem';
import { IoMdSend } from 'react-icons/io';
import { deleteUserChats, getUserChats, sendChatRequest, sendAdviceRequest } from '../helpers/api-communicator';
import {toast } from 'react-hot-toast';
import { useNavigate} from 'react-router-dom';
import './styles.css'
import { grey} from '@mui/material/colors';

type Message ={
  role:"user"|"assistant";
  content:string;
};

type Diagnosis={
  disease: string,
  probability: number,
  description: string,
  precautions: string
}

const Chat = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const auth = useAuth();
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [primaryDiagnosis, setPrimaryDiagnosis] = useState<Diagnosis[]>([]);
  const handleSubmit = async () => {
    const content = inputRef.current?.value as string;
    if (inputRef && inputRef.current) {
      inputRef.current.value = "";
    }
    const newMessage: Message = { role: "user", content };
    setChatMessages((prev) => [...prev, newMessage]);

    console.log("reached setChatMessages first one")
    const wholeResponse = await sendChatRequest(content); //actual output received as { content: {disease, probability, description, precautions}, role }
    console.log(wholeResponse)
    //setPrimaryDiagnosis(()=> [wholeResponse.content]);
    setPrimaryDiagnosis(wholeResponse.chats.content);

    const plsDisease = wholeResponse.chats.content.disease;
    console.log(plsDisease)

    if(wholeResponse.statee=="3"){
    const totalReply= `You're probably experiencing ${plsDisease} right now. If you would like to:`
    const fop = "1. Receieve a detailed description: type 1"
    const sop= "2. Learn about some precautions: type 2"
    const topp = "3. Start over: clear the conversation"

    const newMsg: Message = { role: "assistant", content: totalReply};
    //const newMsg: Message = {content: plsDisease, role: "assistant"};
    
    //const chatData = await sendChatRequest(content); //dummy output as {content: string, role}

    //setChatMessages([...chatData.chats]);
    //setChatMessages([chatData[0].chats]);
    setChatMessages((prev) => [...prev, newMsg]);

    const m2: Message = { role: "assistant", content: fop};
    setChatMessages((prev) => [...prev, m2]);

    const m3: Message = { role: "assistant", content: sop};
    setChatMessages((prev) => [...prev, m3]);

    const m4: Message = { role: "assistant", content: topp};
    setChatMessages((prev) => [...prev, m4]);
    }
    else if(wholeResponse.statee=="1"){
      const totalReply= wholeResponse.chats.content.description
      console.log(totalReply)

      const newMsg: Message = { role: "assistant", content: totalReply};
      setChatMessages((prev) => [...prev, newMsg]);

      const fop = "If you would like to learn about precautions: type 2. Else clear the conversation to start a new one"
      const m2: Message = { role: "assistant", content: fop};
      setChatMessages((prev) => [...prev, m2]);
    }
    else if(wholeResponse.statee=="2"){
      const reply= wholeResponse.chats.content.precautions
      var mainReply=""
      for(let i=0;i<reply.length;i++){
        if(i!=0) mainReply+=", "+reply[i]
        else mainReply+=reply[i]
      }
      
      //console.log(totalReply)

      const newMsg: Message = { role: "assistant", content: mainReply};
      setChatMessages((prev) => [...prev, newMsg]);

      const fop = "If you would like to receieve a detailed description: type 1. Else clear the conversation to start a new one"
      const m2: Message = { role: "assistant", content: fop};
      setChatMessages((prev) => [...prev, m2]);
    }

  };

  const handleDeleteChats = async()=>
    {
      try{
        toast.loading("deleting chats ",{id: "deletechats"});
           await deleteUserChats();
           setChatMessages([]);
           toast.success("deleted chats ",{id: "deletechats"});
      }
      catch(error)
      {
           console.log(error);
      }

    };

  const handleDiagnosisCardPress = async()=>{
    const newMessage: Message = { role: "assistant", content: "What are your symptoms?" };
    setChatMessages((prev) => [...prev, newMessage]);
  };

  const handleAdviceCardPress = async()=>{

    const wholeResponse = await sendAdviceRequest(); //actual output received as { content: {disease, probability, description, precautions}, role }
    console.log(wholeResponse)
  
    const plsDisease = wholeResponse.chats.content.disease;
    console.log(plsDisease)

    const totalReply= `You're probably experiencing ${plsDisease} right now. If you would like to:`
    const fop = "1. Receieve a detailed description: type 1"
    const sop= "2. Learn about some precautions: type 2"
    const topp = "3. Start over: clear the conversation"

    const newMsg: Message = { role: "assistant", content: totalReply};
    //const newMsg: Message = {content: plsDisease, role: "assistant"};
    
    //const chatData = await sendChatRequest(content); //dummy output as {content: string, role}

    //setChatMessages([...chatData.chats]);
    //setChatMessages([chatData[0].chats]);
    setChatMessages((prev) => [...prev, newMsg]);

    const m2: Message = { role: "assistant", content: fop};
    setChatMessages((prev) => [...prev, m2]);

    const m3: Message = { role: "assistant", content: sop};
    setChatMessages((prev) => [...prev, m3]);

    const m4: Message = { role: "assistant", content: topp};
    setChatMessages((prev) => [...prev, m4]);
  };

  useLayoutEffect(()=>{
    if (auth?.isLoggedIn && auth.user)
      {
        toast.loading("Loading chats",{id: "loadchats"});
        getUserChats().then((data)=>{
          setChatMessages([...data.chats]);
          toast.success("Successfully Loaded Chats",{id: "loadchats"});
        }).catch(err=>{
          console.log(err);
          toast.error("Loading Failed", {id :"loadchats"});
      });

      }
  },[auth]);

  useEffect(()=>{
    if(!auth?.user ){
         return navigate("/login");
    }

  },[auth]);

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
          <Typography sx={{mx:'auto',fontFamily:"work sans"}}>
            You are consulting with HealthMate
          </Typography>
          <Button 
          onClick={handleDeleteChats}
          sx={{width:"200px",my:'auto',color:'white',fontWeight:"700",
          borderRadius:3,
          mx:"auto",
           bgcolor : red[300],
           ":hover" :{
            bgcolor:red.A200,
           },
          }}>
           Clear Conversation
          </Button>
          
         </Box>

      </Box>
      <Box sx = {{display:"flex",
        flex:{md:0.8,xs:1,sm:1},
        flexDirection:'column',
        px:3
      }}>
      <Typography sx={{
        textAlign:'center',
        fontSize:"40px",
         color:'white',
          mb:2,
          mx: "auto",
         
      }}>
        HEALTHMATE 

      </Typography>
      <Box sx ={{width:"100%",height:"60vh",borderRadius:3,mx:'auto',
      display:'flex',flexDirection:'column',
      overflow:'scroll', overflowX:'hidden',
      overflowY:"auto",
      scrollBehavior:"smooth"

      }}>
        {
          chatMessages.length > 0 ? 
          <div>
          {chatMessages.map((chat,index)=>
          // @ts-ignore
          <ChatItem content={chat.content} role ={chat.role} key={index}/>
          //<ChatItem content={"ok response"} role ={chat.role} key={index}/>
          )}
          </div>

          :

          <div className="nochat">
                            {/*<div className="nochat-s1">
                                {/* <Image src={chatgptlogo} alt="chatgpt" height={70} width={70} /> }
                                <h1>How can I help you today?</h1>
                            </div> */}
                            <div className="nochat-s2">
                                <Button onClick={handleDiagnosisCardPress} className="suggestioncard" sx={{color:'white',fontWeight:"700",
                                borderRadius:3, bgcolor : grey[600], ":hover" :{bgcolor: grey[300]}}}>
                                    <h2>Diagnosis</h2>
                                    <p>Ask questions to achieve an accurate diagnosis</p>
                                </Button>
                                <Button onClick={handleAdviceCardPress} className="suggestioncard" sx={{color:'white',fontWeight:"700",
                                borderRadius:3, bgcolor : grey[600], ":hover" :{bgcolor: grey[300]}}}>
                                    <h2>Health Analysis</h2>
                                    <p>Receive personalized advice based on your dashboard information</p>
                                </Button>
                            </div>

                        </div>


      }
      </Box>
      <div style={{width:"100%",
        padding:"20px",
        borderRadius:8,
        backgroundColor:"rgb(17,2739)",
       display:"flex",
       margin:"auto"
      }}>
      {" "}
      
      <input
      ref = {inputRef} 
      type="text" style={{width:"100%", backgroundColor:"transparent",
        padding:"10px",border:"none",outline:"auto",
        color:"white",
        fontSize:"20px",
      }}/>
      <IconButton onClick={handleSubmit} sx ={{ml:"auto",color:"white"}}>
      <IoMdSend/>
      </IconButton>
      </div>
      </Box>
  </Box>
};

export default Chat
