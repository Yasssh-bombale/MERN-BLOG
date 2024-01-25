import express from "express";
import { userHome } from "../controllers/user.controller.js";
const router = express.Router();

router.get("/", userHome);

export default router;
