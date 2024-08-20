import express from 'express';
import {register, login, getProfile } from "./Controller.js"
import userMiddleware from "../Middlewares/Authmiddlewares/User.js";
const router = express.Router();

router.post('/login', login);
router.post('/register',  register);
router.get('/profile', userMiddleware, getProfile);
export default router;