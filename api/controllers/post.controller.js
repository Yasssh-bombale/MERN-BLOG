import { Post } from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

export const createPost = async (req, res, next) => {
  const { title, content } = req.body;
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create a post"));
  }
  if (!title || !content) {
    return next(errorHandler(400, "Please provide all required fields"));
  }

  try {
    // creating slug;
    const slug = title
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "");

    //finding if title already exists then return with messsgae;
    const titleExists = await Post.findOne({ title });
    if (titleExists) return next(errorHandler(400, "Title must be unique"));

    //creating new POST:
    const post = await Post.create({
      ...req.body,
      userId: req.user.id,
      slug,
    });
    return res.status(201).json({
      success: true,
      message: "Post created",
      post,
    });
  } catch (error) {
    next(error);
  }
};
