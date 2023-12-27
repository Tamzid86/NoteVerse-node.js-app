import { Router } from "express";
import User from "../models/user.js" ;
import bcrypt from "bcrypt";


const router= Router();
router.post("/register",async(req,res)=>{
    try{
        const {error}=req.body;
        if(error)
            return res.status(400).send({message: error.details[0].message})
        
            const user = await User.findOne({email: req.body.email})
            if(user)
                return res.status(409).send({message: "User with the given email already exists"})

            const salt = await bcrypt.genSalt(Number(process.env.SALT));
            const hashPassword = await bcrypt.hash(req.body.password, salt);

            await new User({...req.body, password:hashPassword}).save()
            res.status(201).send({message:"User created successfully"})
    }
    catch(error)
    {
        res.status(500).send({message: "Internal server error"})
    }
})

router.post("/login", async(req,res)=>{
    try{
        const {error} = req.body;
        if(error)
            return res.status(400).send({message: error.details[0].message})
        const user = await User.findOne({email: req.body.email})
        if(!user)
            return res.status(404).send({message:"This User does not exist"})
        const validPassword= await bcrypt.compare(
            req.body.password,
            user.password
        );
        if(!validPassword)
            return res.status(404).send({message:"Incorrect Password"})
        
        const token= user.generateAuthToken();
        return res.status(200).send({ data: token, message: "logged in successfully" });
        } 
    catch(error){
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
})

router.post("/forgot-password", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send({ message: "Both email and password are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: "User with this email does not exist" });
        }
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(password, salt);
        user.password = hashPassword;
        await user.save();
        res.status(200).send({ message: "Password updated successfully" });
        
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});





router.post("/logout", async(req,res)=>{
    try {
        res.cookie("accessToken", null, {
          expires: new Date(Date.now()),
          httpOnly: true,
        });
        return res.status(200).send({ message: "logout success" });
      } catch (error) {
        return res.status(400).send({ message: "logout failed" });
      }
})
export default router;