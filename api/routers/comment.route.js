import express from "express";
import {
  createComment,
  editComment,
  getComments,
  likeComment,
} from "../controllers/comment.controller.js";
import { isAuthenticated } from "../utils/auth.middleware.js";

const router = express.Router();

router.post("/create", isAuthenticated, createComment);
router.get("/getPostComments/:postId", getComments);
router.put("/likeComments/:commentId", isAuthenticated, likeComment);
router.put("/editComment/:commentId", isAuthenticated, editComment);

export default router;
