import express from "express";
import { config } from "dotenv";
import userRouter from "./routers/user.router.js";
import authRouter from "./routers/auth.router.js";
import postRouter from "./routers/post.route.js";
import commentRouter from "./routers/comment.route.js";
import cookieParser from "cookie-parser";
import path from "path";

config({
  path: ".env", //env file located in root directory
});
const __dirname = path.resolve(); //it will returns an directory where the code is located when code is deployed we need to know what is directory of the code to locate {dist} folder which will be build on production using npm run build command;
export const app = express();
app.use(express.json());
app.use(cookieParser());

// Routers
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);
app.use("/api/comment", commentRouter);

//production;
app.use(express.static(path.join(__dirname, "/client/dist"))); //finding static folder ,it will find index.html inside the build and run the code;

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

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
