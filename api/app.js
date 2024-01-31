import express from "express";
import { config } from "dotenv";
import userRouter from "./routers/user.router.js";
import authRouter from "./routers/auth.router.js";
import cookieParser from "cookie-parser";
config({
  path: ".env", //env file located in root directory
});

export const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

// Middleware for errors

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message,
  });
});

// Note: middleware wants error and we created an errorHandler in utils folder which will overRide an Error class and set error.statusCode and error.message which is provided to the function by parameter as example :- next(errorHandler(500,"got some error")) ;

// and then return error; and next(errorHandler()) as errorHandler() returns error;next will come to middleware and middleware has code that sets statusCode and message variable based on the error object recieved;
