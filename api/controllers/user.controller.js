import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const userHome = (req, res) => {
  return res.send("user home");
};

export const updateUser = async (req, res, next) => {
  const { userId } = req.params;
  let { username, password, email, profilePicture } = req.body;

  // checking requested param's id and cookie_tokens's id is matching or  not;
  if (req.user.id !== userId) {
    return next(errorHandler(401, "You are not allowed to update this user"));
  }

  //if password exists;
  if (password) {
    //if password length is less than 6 then show error;
    if (password.length < 6) {
      return next(errorHandler(400, "password must be at least 6 characters"));
    }
    //if password is more than 6 characters then hash the password;
    password = bcryptjs.hashSync(password, 10); //hashedPassword
  }

  //if username exists;
  if (username) {
    if (username.length < 7 || username.length > 20) {
      return next(
        errorHandler(400, "username must be betweem 7 and 20 characters")
      );
    }
    if (username.includes(" ")) {
      return next(errorHandler(400, "username can not contain spaces")); //spaces not allowed
    }
    if (username !== username.toLowerCase()) {
      return next(errorHandler(400, "username must be lowerCase")); //must be lowerCase
    }
    //check for special characters;
    if (!username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "username can only contain letters and numbers")
      );
    }
  }
  // updating user ;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        //if we directly pass req.body without $set:{} then this is going to update all info meanwhile some user can able to set isAdmin:true for example;
        //$set:{} is update information which is provided it do not touches other information;
        $set: {
          username,
          email,
          password,
          profilePicture,
        },
        //this function will return old information in the database we need updated information to be return and stored in *updateUser variable; it can be done by passing new object {new:true}
      },
      { new: true }
    );

    // seperating password from updateUser for storing it into redux for stateManagement;
    const { password: pass, ...rest } = updatedUser._doc;
    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      rest,
    });
  } catch (error) {
    next(error);
  }
  //
};
