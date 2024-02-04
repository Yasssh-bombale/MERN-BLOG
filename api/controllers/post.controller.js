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

export const getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;

    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1; //1 stands for asc and -1 stands for dsc in mongoDB;

    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }), //if userId exists then search for userId;
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.slug && { slug: req.query.slug }),

      //here we want to search for both title or content; it can be done by $or:[{},{}]
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ], //$option:"i" means uppercase and lowercase not matters
      }),
    })
      .sort({ updateAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments(); //count total number of counts;

    const now = new Date(); //get current time

    const oneMonthAgo = new Date( //--->Overriding current date one month ago
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    return res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};

//delete posts;
export const deletePost = async (req, res, next) => {
  try {
    const { userId, postId } = req.params;

    if (!req.user.isAdmin || userId !== req.user.id) {
      return next(errorHandler(403, "You are not allowed to delete this post"));
    }

    await Post.findByIdAndDelete(postId);

    return res.status(200).json({
      message: "The post has been deleted !",
    });
  } catch (error) {
    next(error);
  }
};

//updatePost;
export const updatePost = async (req, res, next) => {
  const { userId, postId } = req.params;

  if (!req.user.isAdmin || req.user.id !== userId) {
    return next(errorHandler(403, "You are not allowed to update this post"));
  }

  if (
    !req.body.title &&
    !req.body.category &&
    !req.body.image &&
    !req.body.content
  ) {
    return next(errorHandler(400, "No changes provided for update"));
  }

  try {
    // creating slug;
    let slug;
    if (req.body.title) {
      slug = req.body.title
        .split(" ")
        .join("-")
        .toLowerCase()
        .replace(/[^a-zA-Z0-9-]/g, "");
    }

    const post = await Post.findByIdAndUpdate(
      postId,
      // By using $set we are allowing only those information we are setting for example user not able to update userId and slugs
      {
        $set: {
          title: req.body.title,
          category: req.body.category,
          image: req.body.image,
          content: req.body.content,
          slug: slug,
        },
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Post updated",
      post,
    });
  } catch (error) {
    next(error);
  }
};
