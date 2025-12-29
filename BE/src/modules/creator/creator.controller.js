// BE/src/modules/creator/creator.controller.js
import Creator from "../../models/Creator.js";

// Lấy danh sách Creator nổi bật
export const getFeaturedCreators = async (req, res) => {
  try {
    const creators = await Creator.find({ isActive: true })
      .populate("user", "username avatar bio roles") // lấy thêm info từ User
      .sort({ order: 1, createdAt: -1 });

    const formatted = creators.map(c => ({
      _id: c._id,
      name: c.user?.username || "Unknown",
      description: c.description,
      avatar: c.avatar || c.user?.avatar,
      followers: c.followers,
      bio: c.user?.bio,
      isCreator: true
    }));

    res.json({ creators: formatted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "SERVER_ERROR" });
  }
};

// Chi tiết Creator
export const getCreatorDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const creator = await Creator.findById(id)
      .populate("user", "username avatar bio roles");

    if (!creator || !creator.isActive) {
      return res.status(404).json({ error: "NOT_FOUND" });
    }

    res.json({
      creator: {
        id: creator._id,
        name: creator.user?.username,
        description: creator.description,
        avatar: creator.avatar || creator.user?.avatar,
        followers: creator.followers,
        bio: creator.user?.bio
      }
    });
  } catch (err) {
    res.status(500).json({ error: "SERVER_ERROR" });
  }
};