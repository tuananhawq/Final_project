import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Underline from "@tiptap/extension-underline";
import { getLegalConfig, updateLegalConfig } from "../services/legalService";
import { useNotification } from "../context/NotificationContext";
import "../styles/legal-config.css";

const ToolbarButton = ({ label, onClick, disabled, active }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`toolbar-btn ${active ? "active" : ""}`}
  >
    {label}
  </button>
);

const FONT_SIZES = [
  { label: "11", value: "11px" },
  { label: "12", value: "12px" },
  { label: "14", value: "14px" },
  { label: "16", value: "16px" },
  { label: "18", value: "18px" },
  { label: "20", value: "20px" },
];

const RichTextEditor = ({ label, value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color.configure({ types: ["textStyle"] }),
      Underline,
    ],
    content: value || "<p></p>",
    editorProps: {
      attributes: {
        class: "legal-editor__content",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "<p></p>", false);
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="legal-editor">
        <div className="legal-editor__label">{label}</div>
        <div className="legal-editor__loading">Đang khởi tạo editor...</div>
      </div>
    );
  }

  return (
    <div className="legal-editor">
      <div className="legal-editor__label">{label}</div>
      <div className="legal-editor__toolbar">
        <div className="toolbar-group">
          <span className="toolbar-label">Aa</span>
          <select
            className="toolbar-select"
            onChange={(e) => {
              const size = e.target.value;
              if (!size) return;
              editor.chain().focus().setMark("textStyle", { fontSize: size }).run();
            }}
            defaultValue=""
          >
            <option value="" disabled>
              Cỡ chữ
            </option>
            {FONT_SIZES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="toolbar-divider" />

        <ToolbarButton
          label="B"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
        />
        <ToolbarButton
          label="I"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
        />
        <ToolbarButton
          label="U"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
        />

        <div className="toolbar-divider" />

        <ToolbarButton
          label="• List"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={!editor.can().chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
        />
        <ToolbarButton
          label="1. List"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={!editor.can().chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
        />
        <ToolbarButton
          label="H2"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          disabled={!editor.can().chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
        />

        <div className="toolbar-divider" />

        <div className="toolbar-group">
          <span className="toolbar-label">Màu</span>
          <input
            type="color"
            className="toolbar-color"
            onChange={(e) => {
              const color = e.target.value;
              editor.chain().focus().setColor(color).run();
            }}
          />
        </div>

        <div className="toolbar-divider" />

        <ToolbarButton
          label="↺"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
        />
        <ToolbarButton
          label="↻"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
        />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default function LegalConfigManagement() {
  const [termsContent, setTermsContent] = useState("");
  const [privacyContent, setPrivacyContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatedAt, setUpdatedAt] = useState("");
  const { notifySuccess, notifyError } = useNotification();

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const data = await getLegalConfig();
      const config = data.config || {};
      setTermsContent(config.termsContent || "");
      setPrivacyContent(config.privacyContent || "");
      setUpdatedAt(config.updatedAt || config.createdAt || "");
    } catch (error) {
      console.error("Error fetching legal config:", error);
      notifyError("Không thể tải nội dung Điều khoản & Chính sách");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateLegalConfig({ termsContent, privacyContent });
      notifySuccess("Đã lưu nội dung Điều khoản & Chính sách");
      await fetchConfig();
    } catch (error) {
      console.error("Error updating legal config:", error);
      notifyError(
        error.response?.data?.message ||
          "Không thể cập nhật Điều khoản & Chính sách"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="legal-config-management">
        <div className="config-loading">
          <p>Đang tải nội dung...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="legal-config-management">
      <div className="config-header">
        <h2>📄 Cấu hình Điều khoản & Chính sách</h2>
        <p className="config-subtitle">
          Soạn thảo nội dung Điều khoản dịch vụ và Chính sách bảo mật hiển thị
          cho người dùng.
        </p>
        {updatedAt && (
          <p className="config-meta">
            Cập nhật gần nhất: {new Date(updatedAt).toLocaleString("vi-VN")}
          </p>
        )}
        <div className="config-header-actions">
          <a
            href="/legal"
            target="_blank"
            rel="noopener noreferrer"
            className="view-public-link"
          >
            Xem trang Điều khoản & Chính sách cho người dùng
          </a>
        </div>
      </div>

      <div className="config-content">
        <div className="config-section">
          <h3 className="section-title">Điều khoản dịch vụ</h3>
          <RichTextEditor
            label="Nội dung Điều khoản"
            value={termsContent}
            onChange={setTermsContent}
          />
        </div>

        <div className="config-section">
          <h3 className="section-title">Chính sách bảo mật</h3>
          <RichTextEditor
            label="Nội dung Chính sách"
            value={privacyContent}
            onChange={setPrivacyContent}
          />
        </div>

        <div className="config-actions">
          <button
            className="save-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Đang lưu..." : "💾 Lưu nội dung"}
          </button>
        </div>
      </div>
    </div>
  );
}

