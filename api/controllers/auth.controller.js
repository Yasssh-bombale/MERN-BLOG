import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const signUp = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (
      !username ||
      !email ||
      !password ||
      username === "" ||
      email === "" ||
      password === ""
    ) {
      return next(errorHandler(400, "All fields are required"));
    }
    //check for user already eixits in dataBase
    const isEmailTaken = await User.findOne({ email });
    const isUserNameTaken = await User.findOne({ username });

    if (isEmailTaken || isUserNameTaken) {
      return next(
        errorHandler(
          400,
          isEmailTaken ? "User already exists" : "username already taken"
        )
      );
    }

    const hashedPassword = bcryptjs.hashSync(password, 10); //hashing password

    await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "User sign up successfully",
    });
  } catch (error) {
    next(error);
  }
};
