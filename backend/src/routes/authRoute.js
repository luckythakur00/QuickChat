import express from "express";
import { signUpUser, logInUser, logOutUser, updateProfile, checkAuth } from "../controllers/authController.js";
import isLoggedIn from "../middleware/isLoggedIn.js";
import User from "../models/userModel.js";
const router = express.Router();

router.get('/', async (req, res) => {       // Just for example delete it later.
    let data = await User.find();
    res.status(200).json(data);
})

router.post('/signup', signUpUser)

router.post('/login', logInUser)

router.get('/logout', isLoggedIn, logOutUser)

router.put('/update-profile', isLoggedIn, updateProfile)

router.get('/check', isLoggedIn, checkAuth)

export default router