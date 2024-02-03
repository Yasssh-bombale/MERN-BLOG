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
    console.log(req.query.startIndex);
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
