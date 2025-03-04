import { Router } from "express";
import { createGroup, allGroups, dltGroup } from "../controllers/groupController.js";
import isLoggedIn from "../middleware/isLoggedIn.js";
const router = Router();

router.post('/create', isLoggedIn, createGroup)

router.get('/allGroups', allGroups)

router.delete('/deleteGroup/:groupId', dltGroup)

export default router