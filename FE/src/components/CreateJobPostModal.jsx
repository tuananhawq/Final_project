import { useState, useEffect } from "react";
import axios from "axios";
import { API_URLS } from "../config/api.js";

export function CreateJobPostModal({ open, onClose, onSaved, initialData }) {
  const [form, setForm] = useState({
    title: "",
    jobType: "",
    workTime: "",
    content: "",
    budget: "",
    requirements: "",
    benefits: "",
  });
  const [error, setError] = useState("");
  const isEdit = !!initialData;

  // 🔥 Cập nhật form khi initialData thay đổi (khi mở modal sửa)
  useEffect(() => {
    if (open) {
      if (initialData) {
        // Nếu có initialData (đang sửa), load dữ liệu cũ vào form
        setForm({
          title: initialData.title || "",
          jobType: initialData.jobType || "",
          workTime: initialData.workTime || "",
          content: initialData.content || "",
          budget: initialData.budget || "",
          requirements: initialData.requirements || "",
          benefits: initialData.benefits || "",
        });
      } else {
        // Nếu không có initialData (đang tạo mới), reset form
        setForm({
          title: "",
          jobType: "",
          workTime: "",
          content: "",
          budget: "",
          requirements: "",
          benefits: "",
        });
      }
      setError(""); // Reset error khi mở modal
    }
  }, [open, initialData]);

  if (!open) return null;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const {
      title,
      jobType,
      workTime,
      content,
      budget,
      requirements,
      benefits,
    } = form;

    if (
      !title.trim() ||
      !jobType.trim() ||
      !workTime.trim() ||
      !content.trim() ||
      !budget.trim() ||
      !requirements.trim() ||
      !benefits.trim()
    ) {
      setError("Vui lòng nhập đầy đủ tất cả các trường bắt buộc.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (isEdit) {
        await axios.put(
          `${API_URLS.BRAND}/job-post/${initialData._id}`,
          form,
          config
        );
      } else {
        await axios.post(
          `${API_URLS.BRAND}/job-post`,
          form,
          config
        );
      }

      onSaved();
      onClose();
    } catch (err) {
      console.error("Save job post error:", err);
      setError("Có lỗi xảy ra khi lưu tin tuyển dụng.");
    }
  };

  return (
    <div
      className="brand-modal-overlay"
      onClick={() => {
        onClose();
      }}
    >
      <div
        className="brand-modal brand-job-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h3>{isEdit ? "Sửa tin tuyển dụng" : "Đăng tin tuyển dụng mới"}</h3>
        {error && <p className="brand-error-text">{error}</p>}

        <form onSubmit={handleSubmit} className="brand-form">
          <label>
            Tiêu đề bài tuyển dụng *
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Ví dụ: Tuyển Creator Livestream cho chiến dịch A"
            />
          </label>

          <label>
            Loại công việc *
            <input
              type="text"
              value={form.jobType}
              onChange={(e) => handleChange("jobType", e.target.value)}
              placeholder="Full-time / Part-time / Freelance / Campaign-based..."
            />
          </label>

          <label>
            Thời gian làm việc *
            <input
              type="text"
              value={form.workTime}
              onChange={(e) => handleChange("workTime", e.target.value)}
              placeholder="Ví dụ: 3 buổi/tuần, 2 tiếng/buổi..."
            />
          </label>

          <label>
            Ngân sách / Mức lương *
            <input
              type="text"
              value={form.budget}
              onChange={(e) => handleChange("budget", e.target.value)}
              placeholder="Ví dụ: 10.000.000 - 15.000.000 VNĐ / chiến dịch"
            />
          </label>

          <label>
            Nội dung công việc *
            <textarea
              rows={4}
              value={form.content}
              onChange={(e) => handleChange("content", e.target.value)}
              placeholder="Mô tả chi tiết công việc, KPI, timeline..."
            />
          </label>

          <label>
            Yêu cầu ứng viên *
            <textarea
              rows={3}
              value={form.requirements}
              onChange={(e) => handleChange("requirements", e.target.value)}
              placeholder="Kinh nghiệm, kỹ năng, số lượng follower tối thiểu..."
            />
          </label>

          <label>
            Quyền lợi / Hỗ trợ từ Brand *
            <textarea
              rows={3}
              value={form.benefits}
              onChange={(e) => handleChange("benefits", e.target.value)}
              placeholder="Chính sách hỗ trợ, bonus, quyền lợi đặc biệt..."
            />
          </label>

          <div className="brand-form-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => onClose()}
            >
              Hủy
            </button>
            <button type="submit" className="primary-btn">
              {isEdit ? "Lưu thay đổi" : "Đăng bài"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


