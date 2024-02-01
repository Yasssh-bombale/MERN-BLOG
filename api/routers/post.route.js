import express from "express";
import { createPost } from "../controllers/post.controller.js";
import { isAuthenticated } from "../utils/auth.middleware.js";
const router = express.Router();

router.post("/create", isAuthenticated, createPost);

export default router;
