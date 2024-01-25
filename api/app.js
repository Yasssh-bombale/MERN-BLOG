import express from "express";
import { config } from "dotenv";
import userRouter from "./routers/user.router.js";
import authRouter from "./routers/auth.router.js";
config({
  path: ".env", //env file located in root directory
});

export const app = express();
app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
