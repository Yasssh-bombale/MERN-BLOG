import express from "express";
import { updateUser, userHome } from "../controllers/user.controller.js";
import { isAuthenticated } from "../utils/auth.middleware.js";
const router = express.Router();

router.get("/", userHome);
router.put("/update/:userId", isAuthenticated, updateUser);
export default router;
