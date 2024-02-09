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

export const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });
    return res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return next(errorHandler(404, "Comment not found"));

    // check if user already like comment or not;
    const userIndex = comment.likes.indexOf(req.user.id);
    //if no userIndex then it will gives -1;
    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1); //1 indicated delete the index which is userIndex value;
    }
    await comment.save();
    return res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

//editComment;
export const editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) return next(errorHandler(404, "Comment not found"));

    //check for user is owner of comment or not and as well as allow for admins to edit any comment
    if (req.user.id !== comment.userId && !req.user.isAdmin) {
      return next(
        errorHandler(403, "You are not allowed to edit this comment")
      );
    }
    if (!req.body.content) {
      return next(errorHandler(401, "You need to type something..."));
    }

    comment.content = req.body.content;
    comment.save();
    return res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};
