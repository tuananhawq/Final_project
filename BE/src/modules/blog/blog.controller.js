import Blog from "../../models/Blog.js";
import User from "../../models/User.js";
import Notification from "../../models/Notification.js";

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
    // Chỉ staff thấy tất cả blogs
    // User, creator, brand chỉ thấy blog của mình
    // Admin không có quyền xem từ admin panel
    const isStaff = req.user.roles.includes("staff") || req.user.roles.includes("admin");
    
    let query = {};
    if (!isStaff) {
      // Chỉ hiển thị blog của chính user đó
      query.author = req.user.id;
    }

    const blogs = await Blog.find(query)
      .populate("author", "username email roles blogWarningCount isLocked lockedReason")
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
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Chỉ staff có thể chỉnh sửa bất kỳ blog nào
    // User, creator, brand chỉ có thể chỉnh sửa blog của chính mình
    // Admin không có quyền chỉnh sửa blog
    const isStaff = req.user.roles.includes("staff");
    const isOwner = blog.author.toString() === req.user.id;

    if (!isStaff && !isOwner) {
      return res.status(403).json({ error: "You can only edit your own blogs" });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedBlog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Staff có thể xóa bất kỳ blog nào
    // User, creator, brand chỉ có thể xóa blog của chính mình
    const isStaff = req.user.roles.includes("staff") || req.user.roles.includes("admin");
    const isOwner = blog.author.toString() === req.user.id;

    if (!isStaff && !isOwner) {
      return res.status(403).json({ error: "You can only delete your own blogs" });
    }

    // Nếu staff/admin xóa blog của người khác -> tạo notification cho tác giả
    if (isStaff && !isOwner) {
      await Notification.create({
        recipient: blog.author,
        type: "error",
        title: "Bài đăng của bạn đã bị xóa",
        message: `Bài đăng của bạn đã bị staff/admin xóa. Nếu bạn cần thêm thông tin, vui lòng liên hệ bộ phận hỗ trợ.`,
        metadata: {
          blogId: blog._id,
        },
      });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== STAFF MANAGEMENT FUNCTIONS ====================
// Gửi cảnh cáo cho Brand về bài đăng vi phạm
export const warnBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { violationReason, staffNotes } = req.body;

    if (!violationReason) {
      return res.status(400).json({ error: "Violation reason is required" });
    }

    // Chỉ staff mới có quyền cảnh cáo
    const isStaff = req.user.roles.includes("staff") || req.user.roles.includes("admin");
    if (!isStaff) {
      return res.status(403).json({ error: "Only staff can warn blogs" });
    }

    const blog = await Blog.findById(id).populate("author");
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const author = await User.findById(blog.author._id);
    if (!author) {
      return res.status(404).json({ error: "Author not found" });
    }

    // Cập nhật blog status và thông tin cảnh cáo
    blog.status = "warning";
    blog.violationReason = violationReason;
    blog.staffNotes = staffNotes || "";
    blog.warningDate = new Date();
    await blog.save();

    // Tăng số lần cảnh cáo của Brand
    author.blogWarningCount = (author.blogWarningCount || 0) + 1;
    await author.save();

    // Tạo thông báo cho Brand (giống luồng cảnh báo bài đăng tuyển dụng)
    await Notification.create({
      recipient: author._id,
      type: "warning",
      title: "Vi phạm nội dung bài viết",
      message: `Bài viết "${blog.title}" của bạn bị cảnh báo. Lý do: ${violationReason}. (Cảnh báo ${author.blogWarningCount}/3)`,
      metadata: {
        blogId: blog._id,
        violationReason,
        warningCount: author.blogWarningCount,
      },
    });

    res.json({
      message: "Blog warned successfully",
      blog,
      authorWarningCount: author.blogWarningCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Xóa blog với lý do vi phạm nghiêm trọng
export const deleteBlogWithReason = async (req, res) => {
  try {
    const { id } = req.params;
    const { violationReason, staffNotes } = req.body;

    if (!violationReason) {
      return res.status(400).json({ error: "Violation reason is required" });
    }

    // Chỉ staff mới có quyền xóa với lý do
    const isStaff = req.user.roles.includes("staff") || req.user.roles.includes("admin");
    if (!isStaff) {
      return res.status(403).json({ error: "Only staff can delete blogs with reason" });
    }

    const blog = await Blog.findById(id).populate("author");
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const author = await User.findById(blog.author._id);
    if (!author) {
      return res.status(404).json({ error: "Author not found" });
    }

    // Tăng số lần cảnh cáo của Brand
    author.blogWarningCount = (author.blogWarningCount || 0) + 1;
    await author.save();

    // Tạo thông báo cho Brand trước khi xóa
    await Notification.create({
      recipient: author._id,
      type: "error",
      title: "Bài đăng đã bị xóa do vi phạm",
      message: `Bài đăng "${blog.title}" của bạn đã bị xóa do vi phạm nghiêm trọng hoặc không được khắc phục sau cảnh cáo. Lý do: ${violationReason}.`,
      metadata: {
        blogId: blog._id,
        violationReason,
        warningCount: author.blogWarningCount,
      },
    });

    // Xóa blog
    await Blog.findByIdAndDelete(id);

    res.json({
      message: "Blog deleted with reason successfully",
      authorWarningCount: author.blogWarningCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Khóa tài khoản Brand nếu vi phạm quá 3 lần
export const lockBrandAccount = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    // Chỉ staff mới có quyền khóa tài khoản
    const isStaff = req.user.roles.includes("staff") || req.user.roles.includes("admin");
    if (!isStaff) {
      return res.status(403).json({ error: "Only staff can lock accounts" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Chỉ khóa được Brand
    if (!user.roles.includes("brand")) {
      return res.status(400).json({ error: "Can only lock brand accounts" });
    }

    // Kiểm tra số lần cảnh cáo
    if ((user.blogWarningCount || 0) < 3) {
      return res.status(400).json({ 
        error: "Brand must have at least 3 warnings before account can be locked" 
      });
    }

    // Khóa tài khoản
    user.isLocked = true;
    user.lockedReason = reason || "Vi phạm quá 3 lần về bài đăng";
    await user.save();

    // Tạo thông báo cho Brand
    await Notification.create({
      recipient: user._id,
      type: "error",
      title: "Tài khoản đã bị khóa",
      message: `Tài khoản của bạn đã bị khóa do vi phạm quá 3 lần về bài đăng. Lý do: ${user.lockedReason}`,
      metadata: {
        warningCount: user.blogWarningCount,
        lockedReason: user.lockedReason,
      },
    });

    res.json({
      message: "Brand account locked successfully",
      user: {
        _id: user._id,
        email: user.email,
        isLocked: user.isLocked,
        blogWarningCount: user.blogWarningCount,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


