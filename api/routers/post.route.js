import express from "express";
import {
  createPost,
  deletePost,
  getPosts,
  updatePost,
} from "../controllers/post.controller.js";
import { isAuthenticated } from "../utils/auth.middleware.js";
const router = express.Router();

router.post("/create", isAuthenticated, createPost);
router.get("/getposts", getPosts);
router.delete("/delete/:userId/:postId", isAuthenticated, deletePost);
router.put("/update/:postId/:userId", isAuthenticated, updatePost);
export default router;
