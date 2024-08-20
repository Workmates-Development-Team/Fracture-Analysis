import jwt from "jsonwebtoken";
import Users from './models.js'
import { z } from "zod";
import { registerSchema, loginSchema } from "../Middlewares/inputValidation.js";
export const register = async (req, res) => {
    try {
      const { name, email, password,age,address } = registerSchema.parse(req.body);
  
      let User = await Users.findOne({ email });
      if (User) {
        return res.status(400).json({ message: "This mail already exists" });
      }
  
      User = new Users({ name, email, password,age,address });
      await User.save();
  
     
  
      res.status(201).json({
      
        User: { id: User._id, name: User.name, email: User.email },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: error.errors[0]?.message || "Validation error",
        });
      }
      console.log(error)
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  export const login = async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
  
      const User = await Users.findOne({ email });
      if (!User) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      const isMatch = await User.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      const token = jwt.sign({ id: User._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
  
      res.status(200).json({
        token,
        User: { id: User._id, name: User.name, email: User.email },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: error.errors[0]?.message || "Validation error",
        });
      }
  
      console.log(error);
      res.status(500).json({ message: "internal server error" });
    }
  };
  export const getProfile = async (req, res) => {
  
    try{
      const user = req.user;
      user.password = undefined;
     
      res.status(200).json({
        success: true,
        user,});
       
    }
    catch(error){
      return res.status(500).json({
        success: false,
        msg: "Internal server error",
      });
    }
  };