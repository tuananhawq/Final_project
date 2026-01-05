// BE/src/modules/job/job.controller.js
import Job from "../../models/Job.js";

export const getFeaturedJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4; // 4 job/trang
    const skip = (page - 1) * limit;

    const total = await Job.countDocuments({ isActive: true });

    const jobs = await Job.find({ isActive: true })
      .populate("brand")
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const formatted = jobs.map(job => ({
      _id: job._id,
      title: job.title,
      description: job.description,
      logo: job.brand?.logo || "",
      companyName: job.brand?.companyName || "Unknown",
    }));

    res.json({
      jobs: formatted,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalJobs: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "SERVER_ERROR" });
  }
};
// BE/src/modules/job/job.controller.js
export const getJobDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id).populate("brand");

    if (!job || !job.isActive) {
      return res.status(404).json({ error: "NOT_FOUND" });
    }

    const formattedJob = {
      _id: job._id,
      title: job.title,
      description: job.description,
      logo: job.brand?.logo || "",
      companyName: job.brand?.companyName || "RevLive Brand",
      website: job.brand?.website || "",
      // ←←←← THÊM CÁC FIELD MỚI
      requirements: job.requirements || [],
      benefits: job.benefits || [],
      location: job.location || "Hà Nội và các tỉnh",
      salary: job.salary || "Thoả thuận",
    };

    res.json({ job: formattedJob });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "SERVER_ERROR" });
  }
};