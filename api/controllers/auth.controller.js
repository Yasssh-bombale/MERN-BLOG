import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signUp = async (req, res) => {
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
      return res.status(400).json({
        success: false,
        message: "All fileds are required",
      });
    }
    //check for user already eixits in dataBase
    const isEmailTaken = await User.findOne({ email });
    const isUserNameTaken = await User.findOne({ username });

    if (isEmailTaken || isUserNameTaken) {
      return res.status(400).json({
        success: false,
        message: isEmailTaken
          ? "User already exists"
          : "Username already taken",
      });
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
    return res.status(500).json({
      message: error.message,
    });
  }
};
