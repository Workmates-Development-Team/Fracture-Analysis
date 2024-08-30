import express from 'express';
import {register, login, getProfile, getActiveUsers, getNonRadioUsers, getNonDoctorUsers, updateUserDetails, updateDoctorRemarks } from "./Controller.js"
import userMiddleware from "../Middlewares/Authmiddlewares/User.js";
const router = express.Router();

router.post('/login', login);
router.post('/register',  register);
router.get('/profile', userMiddleware, getProfile);
router.get('/active-users', getActiveUsers);
router.get('/non-radio-users', getNonRadioUsers);
router.get('/non-doctor-users', getNonDoctorUsers);
router.put('/update-user-details/:userId', updateUserDetails);
router.put('/update-doctor-remarks/:userId', updateDoctorRemarks);
export default router;