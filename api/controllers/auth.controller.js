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
      return next(errorHandler(400, "User not found"));
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
        message: "User logged in",
        rest,
      });
  } catch (error) {
    next(error);
  }
};

// Google Authentication;
export const google = async (req, res, next) => {
  const { name, email, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    // check for user ,if user exists then we create an token and cookie and return but user not exist then we need to create an user;
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
      //seperating password from user;
      const { password, ...rest } = user._doc;
      return res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json({
          success: true,
          message: "User logged in",
          rest,
        });
    } else {
      //creating user

      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      // creating unique username;
      const generatedUserName =
        name.toLowerCase().split(" ").join("") +
        Math.floor(Math.random() * 10000 + 1);

      const newUser = await User.create({
        username: generatedUserName,
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });

      // now creating token and cookie;
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY);
      //seperating password from user;
      const { password, ...rest } = newUser._doc;

      return res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json({
          success: true,
          message: "User sign up successfully",
          rest,
        });
    }
  } catch (error) {
    next(error);
  }
};
