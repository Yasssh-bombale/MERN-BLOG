import { Comment } from "../models/comment.model.js";
import { errorHandler } from "../utils/error.js";

export const createComment = async (req, res, next) => {
  try {
    const { postId, userId, content } = req.body;

    if (req.user.id !== userId) {
      return next(
        errorHandler(403, "You are not allowed to create this comment")
      );
    }

    if (!content) {
      return next(errorHandler(401, "You need to type something..."));
    }

    const comment = await Comment.create({
      content,
      userId,
      postId,
    });
    return res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};
