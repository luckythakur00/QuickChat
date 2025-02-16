import express from "express";
import isLoggedIn from "../middleware/isLoggedIn.js";
import { getUsersSideBar, getMessages, sendMessage } from "../controllers/messageController.js";
const router = express.Router();

router.get('/users', isLoggedIn, getUsersSideBar)

router.get('/:id', isLoggedIn, getMessages)

router.post('/send/:id', isLoggedIn, sendMessage)

export default router