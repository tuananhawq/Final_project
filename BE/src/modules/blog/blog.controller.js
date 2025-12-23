import Blog from "../../models/Blog.js";
import User from "../../models/User.js";

// ==================== PUBLIC ROUTES ====================
export const getBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, featured, search } = req.query;
    const query = { isPublished: true };

    if (category) query.category = category;
    if (featured === "true") query.featured = true;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const blogs = await Blog.find(query)
      .populate("author", "username email")
      .sort({ featured: -1, publishedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select("-content"); // Không trả về full content trong list

    const total = await Blog.countDocuments(query);

    res.json({
      blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    // Validate ObjectId format
    const { id } = req.params;
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid blog ID format" });
    }

    const blog = await Blog.findById(id)
      .populate("author", "username email")
      .populate("likes", "username");

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Chỉ tăng views nếu blog đã published
    if (blog.isPublished) {
      blog.views += 1;
      await blog.save();
    }

    // Convert to JSON để có thể tính toán averageRating
    const blogObj = blog.toObject();
    if (blog.ratings && blog.ratings.length > 0) {
      const sum = blog.ratings.reduce((acc, r) => acc + r.rating, 0);
      blogObj.averageRating = (sum / blog.ratings.length).toFixed(1);
    } else {
      blogObj.averageRating = 0;
    }

    res.json(blogObj);
  } catch (error) {
    console.error("Error in getBlogById:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getFeaturedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ featured: true, isPublished: true })
      .populate("author", "username")
      .sort({ publishedAt: -1 })
      .limit(3)
      .select("-content");

    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== USER ACTIONS ====================
export const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const userId = req.user.id;
    const likeIndex = blog.likes.indexOf(userId);

    if (likeIndex > -1) {
      blog.likes.splice(likeIndex, 1);
    } else {
      blog.likes.push(userId);
    }

    await blog.save();
    res.json({ likes: blog.likes.length, isLiked: likeIndex === -1 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const rateBlog = async (req, res) => {
  try {
    const { rating } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const userId = req.user.id;
    const existingRating = blog.ratings.find((r) => r.userId.toString() === userId);

    if (existingRating) {
      existingRating.rating = rating;
    } else {
      blog.ratings.push({ userId, rating });
    }

    await blog.save();

    const averageRating = blog.ratings.reduce((acc, r) => acc + r.rating, 0) / blog.ratings.length;

    res.json({
      averageRating: averageRating.toFixed(1),
      totalRatings: blog.ratings.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: "Comment content is required" });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    blog.comments.push({
      userId: req.user.id,
      username: user.username || user.email,
      content,
    });

    await blog.save();

    const newComment = blog.comments[blog.comments.length - 1];
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const commentId = req.params.commentId;
    const comment = blog.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Chỉ cho phép xóa comment của chính mình hoặc staff/admin
    const isOwner = comment.userId.toString() === req.user.id;
    const isStaff = req.user.roles.includes("staff") || req.user.roles.includes("admin");

    if (!isOwner && !isStaff) {
      return res.status(403).json({ error: "Not authorized to delete this comment" });
    }

    blog.comments.pull(commentId);
    await blog.save();

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== ADMIN ROUTES ====================
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "username email")
      .sort({ createdAt: -1 });

    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createBlog = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const blogData = {
      ...req.body,
      author: req.user.id,
      authorName: user.username || user.email,
    };

    const blog = await Blog.create(blogData);
    res.status(201).json(blog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.json(blog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

