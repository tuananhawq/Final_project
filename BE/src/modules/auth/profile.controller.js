import User from "../../models/User.js";

/**
 * GET /api/auth/me
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "_id email username roles bio avatar premiumStatus"
    );

    if (!user) {
      return res.status(404).json({ error: "USER_NOT_FOUND" });
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        roles: user.roles,          // 🔥 HIỆN ROLE RÕ RÀNG
        bio: user.bio,
        avatar: user.avatar,
        premiumStatus: user.premiumStatus
      }
    });
  } catch (err) {
    res.status(500).json({ error: "SERVER_ERROR" });
  }
};

/**
 * PUT /api/auth/me
 */
export const updateProfile = async (req, res) => {
  try {
    const { name, bio, avatar, avatarPublicId } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          username: name,
          bio,
          avatar,
          avatarPublicId
        }
      },
      { new: true }
    ).select("_id email username roles bio avatar premiumStatus");

    if (!user) {
      return res.status(404).json({ error: "USER_NOT_FOUND" });
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        roles: user.roles,          // 🔥 VẪN GIỮ ROLE
        bio: user.bio,
        avatar: user.avatar,
        premiumStatus: user.premiumStatus
      }
    });
  } catch (err) {
    res.status(500).json({ error: "SERVER_ERROR" });
  }
};
