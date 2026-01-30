import { useState, useEffect } from "react";
import axios from "axios";
import { API_URLS } from "../config/api.js";
import { useLanguage } from "../context/LanguageContext";

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
  const { t } = useLanguage();

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
      setError(t("createJobPost.errorRequired"));
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
          `${API_URLS.JOB_POST}/brand/job-post/${initialData._id}`,
          form,
          config
        );
      } else {
        await axios.post(
          `${API_URLS.JOB_POST}/brand/job-post`,
          form,
          config
        );
      }

      onSaved();
      onClose();
    } catch (err) {
      console.error("Save job post error:", err);
      setError(t("createJobPost.errorSave"));
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
        <h3>{isEdit ? t("createJobPost.editTitle") : t("createJobPost.createTitle")}</h3>
        {error && <p className="brand-error-text">{error}</p>}

        <form onSubmit={handleSubmit} className="brand-form">
          <label>
            {t("createJobPost.titleLabel")}
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder={t("createJobPost.titlePlaceholder")}
            />
          </label>

          <label>
            {t("createJobPost.typeLabel")}
            <input
              type="text"
              value={form.jobType}
              onChange={(e) => handleChange("jobType", e.target.value)}
              placeholder={t("createJobPost.typePlaceholder")}
            />
          </label>

          <label>
            {t("createJobPost.timeLabel")}
            <input
              type="text"
              value={form.workTime}
              onChange={(e) => handleChange("workTime", e.target.value)}
              placeholder={t("createJobPost.timePlaceholder")}
            />
          </label>

          <label>
            {t("createJobPost.budgetLabel")}
            <input
              type="text"
              value={form.budget}
              onChange={(e) => handleChange("budget", e.target.value)}
              placeholder={t("createJobPost.budgetPlaceholder")}
            />
          </label>

          <label>
            {t("createJobPost.contentLabel")}
            <textarea
              rows={4}
              value={form.content}
              onChange={(e) => handleChange("content", e.target.value)}
              placeholder={t("createJobPost.contentPlaceholder")}
            />
          </label>

          <label>
            {t("createJobPost.reqLabel")}
            <textarea
              rows={3}
              value={form.requirements}
              onChange={(e) => handleChange("requirements", e.target.value)}
              placeholder={t("createJobPost.reqPlaceholder")}
            />
          </label>

          <label>
            {t("createJobPost.benefitsLabel")}
            <textarea
              rows={3}
              value={form.benefits}
              onChange={(e) => handleChange("benefits", e.target.value)}
              placeholder={t("createJobPost.benefitsPlaceholder")}
            />
          </label>

          <div className="brand-form-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => onClose()}
            >
              {t("createJobPost.cancel")}
            </button>
            <button type="submit" className="primary-btn">
              {isEdit ? t("createJobPost.save") : t("createJobPost.post")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



