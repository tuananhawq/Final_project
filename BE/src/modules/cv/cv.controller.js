import Cv from "../../models/Cv.js";
import User from "../../models/User.js";

// CV đề xuất cho Brand - Lấy TẤT CẢ CV public của Creator
export const getRecommendedCvs = async (req, res) => {
  try {
    // Tìm user là creator có CV public
    const creators = await User.find({
      roles: { $in: ["creator"] },
      isActive: true,
    }).select("_id username avatar");

    const creatorIds = creators.map((u) => u._id);

    // 🔥 Lấy TẤT CẢ CV public của Creator, sort theo createdAt DESC (mới nhất trước)
    const cvs = await Cv.find({
      user: { $in: creatorIds },
      isPublic: true,
    })
      .sort({ createdAt: -1 })
      .lean();

    // Map lại để gắn thông tin user (tên, avatar)
    const usersById = creators.reduce((acc, u) => {
      acc[u._id.toString()] = u;
      return acc;
    }, {});

    const formatted = cvs.map((cv) => {
      const owner = usersById[cv.user.toString()];
      return {
        _id: cv._id,
        fullName: cv.fullName,
        title: cv.title,
        mainSkills: cv.mainSkills || [],
        experienceYears: cv.experienceYears || 0,
        experienceDetail: cv.experienceDetail || "",
        tags: cv.tags || [],
        cvFileUrl: cv.cvFileUrl || "",
        cvFileType: cv.cvFileType || "",
        user: owner
          ? {
              _id: owner._id,
              username: owner.username,
              avatar: owner.avatar,
            }
          : null,
      };
    });

    return res.json({ cvs: formatted });
  } catch (err) {
    console.error("getRecommendedCvs error:", err);
    return res.status(500).json({ error: "SERVER_ERROR" });
  }
};


