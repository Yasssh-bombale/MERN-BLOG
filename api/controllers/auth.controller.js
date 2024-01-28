import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

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

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(400, "All fields are required !"));
  }
  //check for validUser;
  try {
    const validUser = await User.findOne({ email });

    if (!validUser) {
      return next(errorHandler(400, "Invalid User"));
    }
    //check for password;
    const isPasswordMatch = bcryptjs.compareSync(password, validUser.password);
    if (!isPasswordMatch) return next(errorHandler(400, "Incorrect password"));

    // create token for cookie;
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET_KEY);

    //sperating password from validUser;
    const { password: pass, ...rest } = validUser._doc;

    return res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json({
        success: true,
        rest,
      });
  } catch (error) {
    next(error);
  }
};
