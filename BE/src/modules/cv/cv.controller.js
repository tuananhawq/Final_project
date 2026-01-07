import Cv from "../../models/Cv.js";
import User from "../../models/User.js";

// CV đề xuất cho Brand
// Logic mock: lấy ngẫu nhiên một số CV public của creator

export const getRecommendedCvs = async (req, res) => {
  try {
    // Tìm user là creator có CV public
    const creators = await User.find({
      roles: { $in: ["creator"] },
      isActive: true,
    }).select("_id username avatar");

    const creatorIds = creators.map((u) => u._id);

    const matchStage = {
      user: { $in: creatorIds },
      isPublic: true,
    };

    // Mock "đề xuất": random 10 CV
    const cvs = await Cv.aggregate([
      { $match: matchStage },
      { $sample: { size: 10 } },
    ]);

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
        mainSkills: cv.mainSkills,
        experienceYears: cv.experienceYears,
        experienceDetail: cv.experienceDetail,
        tags: cv.tags,
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


