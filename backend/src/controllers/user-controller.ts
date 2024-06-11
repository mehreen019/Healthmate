import { NextFunction, Request, Response } from "express";
import User from "../models/User.js"
import { hash, compare } from 'bcrypt';
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";
import { spawn } from 'child_process';

export const getAllUsers = async (
    req:Request,
    res:Response, 
    next:NextFunction) => {
    //function to get get all users from the backend-database

        try {
            const users = await User.find();
            return res.status(201).json({message: "OK", users});
        } catch (error) {
            console.log(error);
            return res.status(201).json({message: "ERROR", cause : error.message});
        }
}


export const userSignup = async (
    req:Request,
    res:Response, 
    next:NextFunction) => {
    //user signup

    try {
        const {name, email, password} = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser) return res.status(401).send("User already registered");
        const hashedPassword = await hash(password, 10);
        const user = new User({name, email, password : hashedPassword});
        await user.save();

        // create token and store cookie
        
        res.clearCookie(COOKIE_NAME, {
            httpOnly : true,
            domain : "localhost",
            signed : true,
            path : "/",
        });
        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(COOKIE_NAME, token, 
            {path : "/", 
            domain : "localhost", 
            expires,
            httpOnly : true,
            signed : true,
        });
        return res.status(201).json({message: "OK", name:user.name, email:user.email});
    } catch (error) {
        console.log(error);
        return res.status(201).json({message: "ERROR", cause : error.message});
    }
};


export const userLogin = async (
    req:Request,
    res:Response, 
    next:NextFunction) => {
    //user login

    try {
        const {email, password} = req.body;
        const hashedPassword = await hash(password, 10);
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).send("User not registered");
        }
        const isPasswordCorrect = await compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(403).send("Incorrect Password");
        }
        res.clearCookie(COOKIE_NAME, {
            httpOnly : true,
            domain : "localhost",
            signed : true,
            path : "/",
        });
        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(COOKIE_NAME, token, 
            {path : "/", 
            domain : "localhost", 
            expires,
            httpOnly : true,
            signed : true,
        });
        return res.status(200).json({message: "OK", name:user.name, email:user.email});
    } catch (error) {
        console.log(error);
        return res.status(200).json({message: "ERROR", cause : error.message});
    }
};
export const verifyUser = async (
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
        .json({ message: "OK", name: user.name, email: user.email });
    } catch (error) {
      console.log(error);
      return res.status(200).json({ message: "ERROR", cause: error.message });
    }
  };

export const saveDashboardData = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { pulseRate, age, temperature, weight, bloodPressure, pregnancies, glucose,
      skinThickness,
      insulin,
      BMI,
      diabetesPedigree,
      dirBilirubin, totBilirubin, alkPhos, alaAmino, totProtein, albumin, albuminGlobulinRatio, specificGravity, bloodSugar,
        rbcCount, pusCount, pusClumps, clumpThick,  cellSize, cellShape, marginalAdhesion, epithelial, bareNuclei, chromatin,normalNuclei, mitoses
    } = req.body;

    try {
      
        const suser = await User.findById(res.locals.jwtData.id);
        const userId = res.locals.jwtData.id;
        if (!userId) {
            return res.status(401).json({ error: 'User ID not found' });
        }

        
        const user = await User.findByIdAndUpdate(
            userId,
            {
                dashboard: { pulseRate, age, temperature, weight, bloodPressure, pregnancies, glucose,
                skinThickness,
                insulin,
                BMI,
                diabetesPedigree,
                dirBilirubin, totBilirubin, alkPhos, alaAmino, totProtein, albumin, albuminGlobulinRatio, specificGravity, bloodSugar,
                rbcCount, pusCount, pusClumps, clumpThick,  cellSize, cellShape, marginalAdhesion, epithelial, bareNuclei, chromatin,normalNuclei, mitoses
                }
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error('Error saving dashboard data:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


export const getDashboardData = async (req, res) => {
    try {
      const userId = res.locals.jwtData.id; // Assuming you store the user ID in the token
      const user = await User.findById(userId).select('dashboard'); // Adjust field selection as necessary
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      console.log(user.dashboard)
      res.status(200).json(user.dashboard);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  export const getAdvice = async (req, res) => {
    try {
      const userId = res.locals.jwtData.id; // Assuming you store the user ID in the token
      const user = await User.findById(userId).select('dashboard'); // Adjust field selection as necessary
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      console.log(user.dashboard)
      //res.status(200).json(user.dashboard);


      const pythonProcess = spawn('python', ['new_approach/newDashboard.py']);

      pythonProcess.stdin.write(JSON.stringify(user.dashboard) + '\n');
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
        
        //user.chats.push({ content: response, role: "assistant" });    //dummy output as string - change in user schema as well
        //user.chats.push({ content: response, role: "assistant" });  //actual output as JSON

        //await user.save();

        //return res.status(200).json({ chats: user.chats });
        return res.status(200).json({ chats: { content: response, role: "assistant" }});
    });
  }
     catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };


  export const userLogout = async (
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
      res.clearCookie(COOKIE_NAME, {
        httpOnly : true,
        domain : "localhost",
        signed : true,
        path : "/",
    });
      return res
        .status(200)
        .json({ message: "OK", name: user.name, email: user.email });
    } catch (error) {
      console.log(error);
      return res.status(200).json({ message: "ERROR", cause: error.message });
    }
  };
