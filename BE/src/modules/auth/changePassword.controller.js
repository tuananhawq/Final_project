import bcrypt from "bcryptjs";
import User from "../../models/User.js";

// Đổi mật khẩu cho user đã đăng nhập, có log chi tiết
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy id từ req.user.id thay vì req.user.userId
    const { oldPassword, newPassword } = req.body;
    console.log("Change password request:", { userId, oldPassword, newPassword });
    if (!oldPassword || !newPassword) {
      console.log("Thiếu thông tin!");
      return res.status(400).json({ error: "Thiếu thông tin!" });
    }
    const user = await User.findById(userId);
    if (!user) {
      console.log("Không tìm thấy user!");
      return res.status(404).json({ error: "Không tìm thấy user!" });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isMatch) {
      console.log("Mật khẩu cũ không đúng!");
      return res.status(400).json({ error: "Mật khẩu cũ không đúng!" });
    }
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();
    console.log("Đổi mật khẩu thành công!");
    res.json({ message: "Đổi mật khẩu thành công!" });
  } catch (err) {
    console.error("Lỗi server:", err);
    res.status(500).json({ error: "Lỗi server!" });
  }
};
