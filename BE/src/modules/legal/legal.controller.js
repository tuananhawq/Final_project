import LegalConfig from "../../models/LegalConfig.js";

// Public: get terms & privacy content
export const getLegalContent = async (req, res) => {
  try {
    const config = await LegalConfig.getConfig();
    res.json({
      termsContent: config.termsContent || "",
      privacyContent: config.privacyContent || "",
      updatedAt: config.updatedAt,
    });
  } catch (error) {
    console.error("getLegalContent error:", error);
    res.status(500).json({ error: "SERVER_ERROR", message: error.message });
  }
};

// Admin/Staff: get full config (with updatedBy)
export const getLegalConfig = async (req, res) => {
  try {
    const config = await LegalConfig.getConfig();
    res.json({ config });
  } catch (error) {
    console.error("getLegalConfig error:", error);
    res.status(500).json({ error: "SERVER_ERROR", message: error.message });
  }
};

// Admin/Staff: update content
export const updateLegalConfig = async (req, res) => {
  try {
    const { termsContent, privacyContent } = req.body;
    const staffId = req.user.id;

    const config = await LegalConfig.getConfig();

    if (typeof termsContent === "string") {
      config.termsContent = termsContent;
    }

    if (typeof privacyContent === "string") {
      config.privacyContent = privacyContent;
    }

    config.updatedBy = staffId;
    await config.save();

    res.json({
      message: "Cập nhật Điều khoản & Chính sách thành công",
      config,
    });
  } catch (error) {
    console.error("updateLegalConfig error:", error);
    res.status(500).json({ error: "SERVER_ERROR", message: error.message });
  }
};

