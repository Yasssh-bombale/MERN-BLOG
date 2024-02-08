import express from "express";
import { createComment } from "../controllers/comment.controller.js";
import { isAuthenticated } from "../utils/auth.middleware.js";

const router = express.Router();

router.post("/create", isAuthenticated, createComment);

export default router;
