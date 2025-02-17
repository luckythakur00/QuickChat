import express from "express";
import { signUpUser, logInUser, logOutUser, updateProfile, checkAuth } from "../controllers/authController.js";
import isLoggedIn from "../middleware/isLoggedIn.js";
import User from "../models/userModel.js";
const router = express.Router();

router.post('/signup', signUpUser)

router.post('/login', logInUser)

router.get('/logout', isLoggedIn, logOutUser)

router.put('/update-profile', isLoggedIn, updateProfile)

router.get('/check', isLoggedIn, checkAuth)

export default router