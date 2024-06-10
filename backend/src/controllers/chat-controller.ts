import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import { configureOpenAI } from "../config/openai-config.js";
import { OpenAIApi, ChatCompletionRequestMessage } from "openai";
import { spawn } from 'child_process';

export const generateChatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message } = req.body;
  try {

    console.log("reached generatechat in backend")
    const user = await User.findById(res.locals.jwtData.id);
    if (!user){
      return res
        .status(401)
        .json({ message: "User not registered OR Token malfunctioned" });
        console.log("ekhane problem");
    }

    /*
    // grab chats of user
    const chats = user.chats.map(({ role, content }) => ({
      role,
      content,
    })) as ChatCompletionRequestMessage[];
    chats.push({ content: message, role: "user" });
    user.chats.push({ content: message, role: "user" });

    // send all chats with new one to openAI API
    const config = configureOpenAI();
    const openai = new OpenAIApi(config);
    // get latest response
    const chatResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: chats,
    });
    user.chats.push(chatResponse.data.choices[0].message);

    await user.save();
    return res.status(200).json({ chats: user.chats });
    */

    const chats = user.chats.map(({ role, content }) => ({
      role,
      content,
    }));
    chats.push({ content: message, role: "user" });
    user.chats.push({ content: message, role: "user" });

    console.log(message)

    const pythonProcess = spawn('python', ['new_approach/newScript.py']);

    pythonProcess.stdin.write(message + '\n');
    pythonProcess.stdin.end();

    let pythonOutput = '';

    pythonProcess.stdout.on('data', (data) => {

      console.log(data)
      //if(data.disease!="") 
      pythonOutput += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    pythonProcess.on('close', async (code) => {
      if (code !== 0) {
        console.error(`Python process exited with code ${code}`);
        return res.status(500).json({ message: "Python script error" });
      }

      console.log("will parse")

      
      const response = JSON.parse(pythonOutput);

      console.log(response)
      // Save the diagnosis to the user's chat history
      user.chats.push({ content: response, role: "assistant" });    //dummy output as string - change in user schema as well
      //user.chats.push({ content: response, role: "assistant" });  //actual output as JSON

      await user.save();

      //return res.status(200).json({ chats: user.chats });
      return res.status(200).json({ chats: { content: response, role: "assistant" } });
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong " });
    
  }
};

export const sendChatsToUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //user token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }
    return res
      .status(200)
      .json({ message: "OK", chats:user.chats });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};

export const deleteChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //user token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }
    //@ts-ignore
    user.chats=[];
    await user.save();
    return res
      .status(200)
      .json({ message: "OK" });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};