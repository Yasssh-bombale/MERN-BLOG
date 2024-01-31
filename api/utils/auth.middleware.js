import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";
export const isAuthenticated = (req, res, next) => {
  const { access_token } = req.cookies;
  if (!access_token) {
    return next(errorHandler(401, "Unauthorized request"));
  }
  jwt.verify(access_token, process.env.JWT_SECRET_KEY, (error, user) => {
    if (error) {
      return next(errorHandler(401, "Unauthorized request"));
    }
    req.user = user;
    next();
  });
};
