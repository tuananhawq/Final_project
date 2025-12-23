import { useState, useEffect } from "react";
import {
  getAllHeroes,
  createHero,
  updateHero,
  deleteHero,
  getAllAgencies,
  createAgency,
  updateAgency,
  deleteAgency,
  getAllCreators,
  createCreator,
  updateCreator,
  deleteCreator,
  getAllTopics,
  createTopic,
  updateTopic,
  deleteTopic,
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getFooter,
  updateFooter,
} from "../services/homeService.jsx";
import { ImageUpload } from "./ImageUpload.jsx";

export function HomeManagement() {
  const [activeTab, setActiveTab] = useState("hero");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Hero state
  const [heroes, setHeroes] = useState([]);
  const [heroForm, setHeroForm] = useState({
    title: "",
    titleHighlight: "",
    description: "",
    ctaText: "",
    backgroundImage: "",
    isActive: true,
  });
  const [editingHero, setEditingHero] = useState(null);

  // Agency state
  const [agencies, setAgencies] = useState([]);
  const [agencyForm, setAgencyForm] = useState({
    name: "",
    rank: "TOP 1",
    image: "",
    size: "small",
    isActive: true,
  });
  const [editingAgency, setEditingAgency] = useState(null);

  // Creator state
  const [creators, setCreators] = useState([]);
  const [creatorForm, setCreatorForm] = useState({
    name: "",
    description: "",
    avatar: "",
    followers: "",
    isActive: true,
  });
  const [editingCreator, setEditingCreator] = useState(null);

  // Topic state
  const [topics, setTopics] = useState([]);
  const [topicForm, setTopicForm] = useState({
    title: "",
    image: "",
    position: "center",
    isActive: true,
  });
  const [editingTopic, setEditingTopic] = useState(null);

  // Testimonial state
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialForm, setTestimonialForm] = useState({
    name: "",
    role: "",
    content: "",
    avatar: "",
    isActive: true,
  });
  const [editingTestimonial, setEditingTestimonial] = useState(null);

  // Footer state
  const [footer, setFooter] = useState(null);
  const [footerForm, setFooterForm] = useState({
    description: "",
    supportPhone: "",
    officeLocation: "",
    socialLinks: {
      facebook: "",
      twitter: "",
      instagram: "",
    },
    footerLinks: [],
  });

  // Load data functions
  const loadHeroes = async () => {
    try {
      const data = await getAllHeroes();
      setHeroes(data);
    } catch (error) {
      showMessage("Lỗi khi tải heroes: " + error.message, "error");
    }
  };

  const loadAgencies = async () => {
    try {
      const data = await getAllAgencies();
      setAgencies(data);
    } catch (error) {
      showMessage("Lỗi khi tải agencies: " + error.message, "error");
    }
  };

  const loadCreators = async () => {
    try {
      const data = await getAllCreators();
      setCreators(data);
    } catch (error) {
      showMessage("Lỗi khi tải creators: " + error.message, "error");
    }
  };

  const loadTopics = async () => {
    try {
      const data = await getAllTopics();
      setTopics(data);
    } catch (error) {
      showMessage("Lỗi khi tải topics: " + error.message, "error");
    }
  };

  const loadTestimonials = async () => {
    try {
      const data = await getAllTestimonials();
      setTestimonials(data);
    } catch (error) {
      showMessage("Lỗi khi tải testimonials: " + error.message, "error");
    }
  };

  const loadFooter = async () => {
    try {
      const data = await getFooter();
      setFooter(data);
      setFooterForm({
        description: data.description || "",
        supportPhone: data.supportPhone || "",
        officeLocation: data.officeLocation || "",
        socialLinks: {
          facebook: data.socialLinks?.facebook || "",
          twitter: data.socialLinks?.twitter || "",
          instagram: data.socialLinks?.instagram || "",
        },
        footerLinks: data.footerLinks || [],
      });
    } catch (error) {
      showMessage("Lỗi khi tải footer: " + error.message, "error");
    }
  };

  useEffect(() => {
    if (activeTab === "hero") loadHeroes();
    if (activeTab === "agency") loadAgencies();
    if (activeTab === "creator") loadCreators();
    if (activeTab === "topic") loadTopics();
    if (activeTab === "testimonial") loadTestimonials();
    if (activeTab === "footer") loadFooter();
  }, [activeTab]);

  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  // Hero handlers
  const handleHeroSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingHero) {
        await updateHero(editingHero._id, heroForm);
        showMessage("Cập nhật Hero thành công!");
      } else {
        await createHero(heroForm);
        showMessage("Tạo Hero thành công!");
      }
      setHeroForm({
        title: "",
        titleHighlight: "",
        description: "",
        ctaText: "",
        backgroundImage: "",
        isActive: true,
      });
      setEditingHero(null);
      loadHeroes();
    } catch (error) {
      showMessage("Lỗi: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditHero = (hero) => {
    setEditingHero(hero);
    setHeroForm({
      title: hero.title || "",
      titleHighlight: hero.titleHighlight || "",
      description: hero.description || "",
      ctaText: hero.ctaText || "",
      backgroundImage: hero.backgroundImage || "",
      isActive: hero.isActive !== undefined ? hero.isActive : true,
    });
  };

  const handleDeleteHero = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa Hero này?")) return;
    try {
      await deleteHero(id);
      showMessage("Xóa Hero thành công!");
      loadHeroes();
    } catch (error) {
      showMessage("Lỗi: " + error.message, "error");
    }
  };

  // Agency handlers
  const handleAgencySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingAgency) {
        await updateAgency(editingAgency._id, agencyForm);
        showMessage("Cập nhật Agency thành công!");
      } else {
        await createAgency(agencyForm);
        showMessage("Tạo Agency thành công!");
      }
      setAgencyForm({
        name: "",
        rank: "TOP 1",
        image: "",
        size: "small",
        isActive: true,
      });
      setEditingAgency(null);
      loadAgencies();
    } catch (error) {
      showMessage("Lỗi: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditAgency = (agency) => {
    setEditingAgency(agency);
    setAgencyForm({
      name: agency.name || "",
      rank: agency.rank || "TOP 1",
      image: agency.image || "",
      size: agency.size || "small",
      isActive: agency.isActive !== undefined ? agency.isActive : true,
    });
  };

  const handleDeleteAgency = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa Agency này?")) return;
    try {
      await deleteAgency(id);
      showMessage("Xóa Agency thành công!");
      loadAgencies();
    } catch (error) {
      showMessage("Lỗi: " + error.message, "error");
    }
  };

  // Creator handlers
  const handleCreatorSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingCreator) {
        await updateCreator(editingCreator._id, creatorForm);
        showMessage("Cập nhật Creator thành công!");
      } else {
        await createCreator(creatorForm);
        showMessage("Tạo Creator thành công!");
      }
      setCreatorForm({
        name: "",
        description: "",
        avatar: "",
        followers: "",
        isActive: true,
      });
      setEditingCreator(null);
      loadCreators();
    } catch (error) {
      showMessage("Lỗi: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditCreator = (creator) => {
    setEditingCreator(creator);
    setCreatorForm({
      name: creator.name || "",
      description: creator.description || "",
      avatar: creator.avatar || "",
      followers: creator.followers || "",
      isActive: creator.isActive !== undefined ? creator.isActive : true,
    });
  };

  const handleDeleteCreator = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa Creator này?")) return;
    try {
      await deleteCreator(id);
      showMessage("Xóa Creator thành công!");
      loadCreators();
    } catch (error) {
      showMessage("Lỗi: " + error.message, "error");
    }
  };

  // Topic handlers
  const handleTopicSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingTopic) {
        await updateTopic(editingTopic._id, topicForm);
        showMessage("Cập nhật Topic thành công!");
      } else {
        await createTopic(topicForm);
        showMessage("Tạo Topic thành công!");
      }
      setTopicForm({
        title: "",
        image: "",
        position: "center",
        isActive: true,
      });
      setEditingTopic(null);
      loadTopics();
    } catch (error) {
      showMessage("Lỗi: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditTopic = (topic) => {
    setEditingTopic(topic);
    setTopicForm({
      title: topic.title || "",
      image: topic.image || "",
      position: topic.position || "center",
      isActive: topic.isActive !== undefined ? topic.isActive : true,
    });
  };

  const handleDeleteTopic = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa Topic này?")) return;
    try {
      await deleteTopic(id);
      showMessage("Xóa Topic thành công!");
      loadTopics();
    } catch (error) {
      showMessage("Lỗi: " + error.message, "error");
    }
  };

  // Testimonial handlers
  const handleTestimonialSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingTestimonial) {
        await updateTestimonial(editingTestimonial._id, testimonialForm);
        showMessage("Cập nhật Testimonial thành công!");
      } else {
        await createTestimonial(testimonialForm);
        showMessage("Tạo Testimonial thành công!");
      }
      setTestimonialForm({
        name: "",
        role: "",
        content: "",
        avatar: "",
        isActive: true,
      });
      setEditingTestimonial(null);
      loadTestimonials();
    } catch (error) {
      showMessage("Lỗi: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditTestimonial = (testimonial) => {
    setEditingTestimonial(testimonial);
    setTestimonialForm({
      name: testimonial.name || "",
      role: testimonial.role || "",
      content: testimonial.content || "",
      avatar: testimonial.avatar || "",
      isActive: testimonial.isActive !== undefined ? testimonial.isActive : true,
    });
  };

  const handleDeleteTestimonial = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa Testimonial này?")) return;
    try {
      await deleteTestimonial(id);
      showMessage("Xóa Testimonial thành công!");
      loadTestimonials();
    } catch (error) {
      showMessage("Lỗi: " + error.message, "error");
    }
  };

  // Footer handler
  const handleFooterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateFooter(footerForm);
      showMessage("Cập nhật Footer thành công!");
      loadFooter();
    } catch (error) {
      showMessage("Lỗi: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const addFooterLink = () => {
    setFooterForm({
      ...footerForm,
      footerLinks: [...footerForm.footerLinks, { label: "", url: "" }],
    });
  };

  const removeFooterLink = (index) => {
    setFooterForm({
      ...footerForm,
      footerLinks: footerForm.footerLinks.filter((_, i) => i !== index),
    });
  };

  const updateFooterLink = (index, field, value) => {
    const newLinks = [...footerForm.footerLinks];
    newLinks[index][field] = value;
    setFooterForm({ ...footerForm, footerLinks: newLinks });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>Quản lý nội dung trang Home</h2>

      {message && (
        <div
          style={{
            padding: "10px",
            marginBottom: "20px",
            backgroundColor: message.includes("Lỗi") ? "#fee" : "#efe",
            color: message.includes("Lỗi") ? "#c00" : "#0c0",
            borderRadius: "4px",
          }}
        >
          {message}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", borderBottom: "2px solid #e5e7eb" }}>
        {["hero", "agency", "creator", "topic", "testimonial", "footer"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "10px 20px",
              border: "none",
              background: activeTab === tab ? "#111827" : "transparent",
              color: activeTab === tab ? "#fff" : "#666",
              cursor: "pointer",
              borderBottom: activeTab === tab ? "2px solid #111827" : "none",
              marginBottom: "-2px",
            }}
          >
            {tab === "hero" && "Hero"}
            {tab === "agency" && "Agencies"}
            {tab === "creator" && "Creators"}
            {tab === "topic" && "Topics"}
            {tab === "testimonial" && "Testimonials"}
            {tab === "footer" && "Footer"}
          </button>
        ))}
      </div>

      {/* Hero Tab */}
      {activeTab === "hero" && (
        <div>
          <h3>{editingHero ? "Chỉnh sửa Hero" : "Thêm Hero mới"}</h3>
          <form onSubmit={handleHeroSubmit} style={{ marginBottom: "30px" }}>
            <div style={{ display: "grid", gap: "10px", maxWidth: "600px" }}>
              <input
                type="text"
                placeholder="Tiêu đề"
                value={heroForm.title}
                onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                required
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
              />
              <input
                type="text"
                placeholder="Tiêu đề highlight (Creator & Brand)"
                value={heroForm.titleHighlight}
                onChange={(e) => setHeroForm({ ...heroForm, titleHighlight: e.target.value })}
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
              />
              <textarea
                placeholder="Mô tả"
                value={heroForm.description}
                onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
                required
                rows={3}
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
              />
              <input
                type="text"
                placeholder="Text nút CTA"
                value={heroForm.ctaText}
                onChange={(e) => setHeroForm({ ...heroForm, ctaText: e.target.value })}
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
              />
              <ImageUpload
                label="Hình ảnh nền"
                value={heroForm.backgroundImage}
                onChange={(url) => setHeroForm({ ...heroForm, backgroundImage: url })}
                required
              />
              <label>
                <input
                  type="checkbox"
                  checked={heroForm.isActive}
                  onChange={(e) => setHeroForm({ ...heroForm, isActive: e.target.checked })}
                />
                {" "}Hiển thị
              </label>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "10px 20px",
                  background: "#111827",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Đang xử lý..." : editingHero ? "Cập nhật" : "Tạo mới"}
              </button>
              {editingHero && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingHero(null);
                    setHeroForm({
                      title: "",
                      titleHighlight: "",
                      description: "",
                      ctaText: "",
                      backgroundImage: "",
                      isActive: true,
                    });
                  }}
                  style={{
                    padding: "10px 20px",
                    background: "#666",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Hủy
                </button>
              )}
            </div>
          </form>

          <h3>Danh sách Heroes</h3>
          <div style={{ display: "grid", gap: "10px" }}>
            {heroes.map((hero) => (
              <div
                key={hero._id}
                style={{
                  padding: "15px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong>{hero.title} {hero.titleHighlight}</strong>
                  <p style={{ margin: "5px 0", color: "#666" }}>{hero.description}</p>
                  <span style={{ fontSize: "12px", color: hero.isActive ? "#0c0" : "#c00" }}>
                    {hero.isActive ? "Đang hiển thị" : "Ẩn"}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => handleEditHero(hero)}
                    style={{
                      padding: "5px 15px",
                      background: "#111827",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteHero(hero._id)}
                    style={{
                      padding: "5px 15px",
                      background: "#c00",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Agency Tab */}
      {activeTab === "agency" && (
        <div>
          <h3>{editingAgency ? "Chỉnh sửa Agency" : "Thêm Agency mới"}</h3>
          <form onSubmit={handleAgencySubmit} style={{ marginBottom: "30px" }}>
            <div style={{ display: "grid", gap: "10px", maxWidth: "600px" }}>
              <input
                type="text"
                placeholder="Tên Agency"
                value={agencyForm.name}
                onChange={(e) => setAgencyForm({ ...agencyForm, name: e.target.value })}
                required
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
              />
              <select
                value={agencyForm.rank}
                onChange={(e) => setAgencyForm({ ...agencyForm, rank: e.target.value })}
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
              >
                <option value="TOP 1">TOP 1</option>
                <option value="TOP 2">TOP 2</option>
                <option value="TOP 3">TOP 3</option>
              </select>
              <ImageUpload
                label="Hình ảnh"
                value={agencyForm.image}
                onChange={(url) => setAgencyForm({ ...agencyForm, image: url })}
                required
              />
              <select
                value={agencyForm.size}
                onChange={(e) => setAgencyForm({ ...agencyForm, size: e.target.value })}
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
              >
                <option value="small">Nhỏ</option>
                <option value="large">Lớn</option>
              </select>
              <label>
                <input
                  type="checkbox"
                  checked={agencyForm.isActive}
                  onChange={(e) => setAgencyForm({ ...agencyForm, isActive: e.target.checked })}
                />
                {" "}Hiển thị
              </label>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "10px 20px",
                  background: "#111827",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Đang xử lý..." : editingAgency ? "Cập nhật" : "Tạo mới"}
              </button>
              {editingAgency && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingAgency(null);
                    setAgencyForm({
                      name: "",
                      rank: "TOP 1",
                      image: "",
                      size: "small",
                      isActive: true,
                    });
                  }}
                  style={{
                    padding: "10px 20px",
                    background: "#666",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Hủy
                </button>
              )}
            </div>
          </form>

          <h3>Danh sách Agencies</h3>
          <div style={{ display: "grid", gap: "10px" }}>
            {agencies.map((agency) => (
              <div
                key={agency._id}
                style={{
                  padding: "15px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong>{agency.rank} - {agency.name}</strong>
                  <p style={{ margin: "5px 0", color: "#666" }}>Size: {agency.size}</p>
                  <span style={{ fontSize: "12px", color: agency.isActive ? "#0c0" : "#c00" }}>
                    {agency.isActive ? "Đang hiển thị" : "Ẩn"}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => handleEditAgency(agency)}
                    style={{
                      padding: "5px 15px",
                      background: "#111827",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteAgency(agency._id)}
                    style={{
                      padding: "5px 15px",
                      background: "#c00",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Creator Tab */}
      {activeTab === "creator" && (
        <div>
          <h3>{editingCreator ? "Chỉnh sửa Creator" : "Thêm Creator mới"}</h3>
          <form onSubmit={handleCreatorSubmit} style={{ marginBottom: "30px" }}>
            <div style={{ display: "grid", gap: "10px", maxWidth: "600px" }}>
              <input
                type="text"
                placeholder="Tên Creator"
                value={creatorForm.name}
                onChange={(e) => setCreatorForm({ ...creatorForm, name: e.target.value })}
                required
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
              />
              <input
                type="text"
                placeholder="Mô tả (ví dụ: Content Creator - 1.2M followers)"
                value={creatorForm.description}
                onChange={(e) => setCreatorForm({ ...creatorForm, description: e.target.value })}
                required
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
              />
              <ImageUpload
                label="Avatar"
                value={creatorForm.avatar}
                onChange={(url) => setCreatorForm({ ...creatorForm, avatar: url })}
                required
              />
              <input
                type="text"
                placeholder="Số followers (tùy chọn)"
                value={creatorForm.followers}
                onChange={(e) => setCreatorForm({ ...creatorForm, followers: e.target.value })}
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
              />
              <label>
                <input
                  type="checkbox"
                  checked={creatorForm.isActive}
                  onChange={(e) => setCreatorForm({ ...creatorForm, isActive: e.target.checked })}
                />
                {" "}Hiển thị
              </label>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "10px 20px",
                  background: "#111827",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Đang xử lý..." : editingCreator ? "Cập nhật" : "Tạo mới"}
              </button>
              {editingCreator && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingCreator(null);
                    setCreatorForm({
                      name: "",
                      description: "",
                      avatar: "",
                      followers: "",
                      isActive: true,
                    });
                  }}
                  style={{
                    padding: "10px 20px",
                    background: "#666",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Hủy
                </button>
              )}
            </div>
          </form>

          <h3>Danh sách Creators</h3>
          <div style={{ display: "grid", gap: "10px" }}>
            {creators.map((creator) => (
              <div
                key={creator._id}
                style={{
                  padding: "15px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong>{creator.name}</strong>
                  <p style={{ margin: "5px 0", color: "#666" }}>{creator.description}</p>
                  <span style={{ fontSize: "12px", color: creator.isActive ? "#0c0" : "#c00" }}>
                    {creator.isActive ? "Đang hiển thị" : "Ẩn"}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => handleEditCreator(creator)}
                    style={{
                      padding: "5px 15px",
                      background: "#111827",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteCreator(creator._id)}
                    style={{
                      padding: "5px 15px",
                      background: "#c00",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Topic Tab */}
      {activeTab === "topic" && (
        <div>
          <h3>{editingTopic ? "Chỉnh sửa Topic" : "Thêm Topic mới"}</h3>
          <form onSubmit={handleTopicSubmit} style={{ marginBottom: "30px" }}>
            <div style={{ display: "grid", gap: "10px", maxWidth: "600px" }}>
              <input
                type="text"
                placeholder="Tên chủ đề"
                value={topicForm.title}
                onChange={(e) => setTopicForm({ ...topicForm, title: e.target.value })}
                required
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
              />
              <ImageUpload
                label="Hình ảnh"
                value={topicForm.image}
                onChange={(url) => setTopicForm({ ...topicForm, image: url })}
                required
              />
              <select
                value={topicForm.position}
                onChange={(e) => setTopicForm({ ...topicForm, position: e.target.value })}
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
              >
                <option value="left">Trái</option>
                <option value="center">Giữa</option>
                <option value="right">Phải</option>
              </select>
              <label>
                <input
                  type="checkbox"
                  checked={topicForm.isActive}
                  onChange={(e) => setTopicForm({ ...topicForm, isActive: e.target.checked })}
                />
                {" "}Hiển thị
              </label>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "10px 20px",
                  background: "#111827",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Đang xử lý..." : editingTopic ? "Cập nhật" : "Tạo mới"}
              </button>
              {editingTopic && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingTopic(null);
                    setTopicForm({
                      title: "",
                      image: "",
                      position: "center",
                      isActive: true,
                    });
                  }}
                  style={{
                    padding: "10px 20px",
                    background: "#666",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Hủy
                </button>
              )}
            </div>
          </form>

          <h3>Danh sách Topics</h3>
          <div style={{ display: "grid", gap: "10px" }}>
            {topics.map((topic) => (
              <div
                key={topic._id}
                style={{
                  padding: "15px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong>{topic.title}</strong>
                  <p style={{ margin: "5px 0", color: "#666" }}>Vị trí: {topic.position}</p>
                  <span style={{ fontSize: "12px", color: topic.isActive ? "#0c0" : "#c00" }}>
                    {topic.isActive ? "Đang hiển thị" : "Ẩn"}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => handleEditTopic(topic)}
                    style={{
                      padding: "5px 15px",
                      background: "#111827",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteTopic(topic._id)}
                    style={{
                      padding: "5px 15px",
                      background: "#c00",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Testimonial Tab */}
      {activeTab === "testimonial" && (
        <div>
          <h3>{editingTestimonial ? "Chỉnh sửa Testimonial" : "Thêm Testimonial mới"}</h3>
          <form onSubmit={handleTestimonialSubmit} style={{ marginBottom: "30px" }}>
            <div style={{ display: "grid", gap: "10px", maxWidth: "600px" }}>
              <input
                type="text"
                placeholder="Tên người đánh giá"
                value={testimonialForm.name}
                onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                required
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
              />
              <input
                type="text"
                placeholder="Vai trò (ví dụ: CEO - TechStart)"
                value={testimonialForm.role}
                onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })}
                required
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
              />
              <textarea
                placeholder="Nội dung đánh giá"
                value={testimonialForm.content}
                onChange={(e) => setTestimonialForm({ ...testimonialForm, content: e.target.value })}
                required
                rows={4}
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
              />
              <ImageUpload
                label="Avatar"
                value={testimonialForm.avatar}
                onChange={(url) => setTestimonialForm({ ...testimonialForm, avatar: url })}
                required
              />
              <label>
                <input
                  type="checkbox"
                  checked={testimonialForm.isActive}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, isActive: e.target.checked })}
                />
                {" "}Hiển thị
              </label>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "10px 20px",
                  background: "#111827",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Đang xử lý..." : editingTestimonial ? "Cập nhật" : "Tạo mới"}
              </button>
              {editingTestimonial && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingTestimonial(null);
                    setTestimonialForm({
                      name: "",
                      role: "",
                      content: "",
                      avatar: "",
                      isActive: true,
                    });
                  }}
                  style={{
                    padding: "10px 20px",
                    background: "#666",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Hủy
                </button>
              )}
            </div>
          </form>

          <h3>Danh sách Testimonials</h3>
          <div style={{ display: "grid", gap: "10px" }}>
            {testimonials.map((testimonial) => (
              <div
                key={testimonial._id}
                style={{
                  padding: "15px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong>{testimonial.name}</strong>
                  <p style={{ margin: "5px 0", color: "#666" }}>{testimonial.role}</p>
                  <p style={{ margin: "5px 0", fontSize: "14px" }}>{testimonial.content}</p>
                  <span style={{ fontSize: "12px", color: testimonial.isActive ? "#0c0" : "#c00" }}>
                    {testimonial.isActive ? "Đang hiển thị" : "Ẩn"}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => handleEditTestimonial(testimonial)}
                    style={{
                      padding: "5px 15px",
                      background: "#111827",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteTestimonial(testimonial._id)}
                    style={{
                      padding: "5px 15px",
                      background: "#c00",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Tab */}
      {activeTab === "footer" && (
        <div>
          <h3>Chỉnh sửa Footer</h3>
          <form onSubmit={handleFooterSubmit} style={{ marginBottom: "30px" }}>
            <div style={{ display: "grid", gap: "10px", maxWidth: "600px" }}>
              <textarea
                placeholder="Mô tả"
                value={footerForm.description}
                onChange={(e) => setFooterForm({ ...footerForm, description: e.target.value })}
                rows={3}
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
              />
              <input
                type="text"
                placeholder="Số điện thoại hỗ trợ"
                value={footerForm.supportPhone}
                onChange={(e) => setFooterForm({ ...footerForm, supportPhone: e.target.value })}
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
              />
              <input
                type="text"
                placeholder="Địa chỉ văn phòng"
                value={footerForm.officeLocation}
                onChange={(e) => setFooterForm({ ...footerForm, officeLocation: e.target.value })}
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
              />
              <h4>Social Links</h4>
              <input
                type="text"
                placeholder="Facebook URL"
                value={footerForm.socialLinks.facebook}
                onChange={(e) =>
                  setFooterForm({
                    ...footerForm,
                    socialLinks: { ...footerForm.socialLinks, facebook: e.target.value },
                  })
                }
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
              />
              <input
                type="text"
                placeholder="Twitter URL"
                value={footerForm.socialLinks.twitter}
                onChange={(e) =>
                  setFooterForm({
                    ...footerForm,
                    socialLinks: { ...footerForm.socialLinks, twitter: e.target.value },
                  })
                }
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
              />
              <input
                type="text"
                placeholder="Instagram URL"
                value={footerForm.socialLinks.instagram}
                onChange={(e) =>
                  setFooterForm({
                    ...footerForm,
                    socialLinks: { ...footerForm.socialLinks, instagram: e.target.value },
                  })
                }
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
              />
              <h4>Footer Links</h4>
              {footerForm.footerLinks.map((link, index) => (
                <div key={index} style={{ display: "flex", gap: "10px" }}>
                  <input
                    type="text"
                    placeholder="Label"
                    value={link.label}
                    onChange={(e) => updateFooterLink(index, "label", e.target.value)}
                    style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd", flex: 1 }}
                  />
                  <input
                    type="text"
                    placeholder="URL"
                    value={link.url}
                    onChange={(e) => updateFooterLink(index, "url", e.target.value)}
                    style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd", flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => removeFooterLink(index)}
                    style={{
                      padding: "8px 15px",
                      background: "#c00",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Xóa
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addFooterLink}
                style={{
                  padding: "10px 20px",
                  background: "#666",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                + Thêm Link
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "10px 20px",
                  background: "#111827",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Đang xử lý..." : "Cập nhật Footer"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

