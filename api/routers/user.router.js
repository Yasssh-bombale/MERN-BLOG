import express from "express";
import {
  deleteUser,
  signOut,
  updateUser,
  userHome,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../utils/auth.middleware.js";
const router = express.Router();

router.get("/", userHome);
router.put("/update/:userId", isAuthenticated, updateUser);
router.delete("/delete/:userId", isAuthenticated, deleteUser);
router.post("/signout", signOut);

export default router;
