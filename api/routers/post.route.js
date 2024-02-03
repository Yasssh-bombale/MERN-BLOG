import express from "express";
import { createPost, getPosts } from "../controllers/post.controller.js";
import { isAuthenticated } from "../utils/auth.middleware.js";
const router = express.Router();

router.post("/create", isAuthenticated, createPost);
router.get("/getposts", getPosts);

export default router;
