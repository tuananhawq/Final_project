// BE/src/modules/creator/creator.controller.js
import Creator from "../../models/Creator.js";

// Lấy danh sách Creator nổi bật (isActive: true), sắp xếp theo order
export const getFeaturedCreators = async (req, res) => {
  try {
    const creators = await Creator.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .select("name description avatar followers");

    res.json({ creators });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "SERVER_ERROR" });
  }
};

// Lấy chi tiết 1 Creator theo ID
export const getCreatorDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const creator = await Creator.findById(id)
      .select("name description avatar followers");

    if (!creator || !creator.isActive) {
      return res.status(404).json({ error: "NOT_FOUND" });
    }

    res.json({ creator });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "SERVER_ERROR" });
  }
};