import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URLS } from "../config/api.js";

export function RecommendedCV() {
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");
  const [skillTags, setSkillTags] = useState([]);
  const [filteredCvs, setFilteredCvs] = useState([]);

  const fetchCvs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setCvs([]);
        return;
      }

      const res = await axios.get(
        `${API_URLS.CV}/recommended`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const cvsData = res.data.cvs || [];
      setCvs(cvsData);
      
      // Extract unique skills for filter
      const allSkills = cvsData.flatMap(cv => cv.mainSkills || []);
      const uniqueSkills = [...new Set(allSkills)];
      setSkillTags(uniqueSkills);
      
    } catch (err) {
      console.error("Fetch recommended CV error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort CVs
  useEffect(() => {
    let filtered = [...cvs];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(cv => 
        cv.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cv.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cv.mainSkills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Skill filter
    if (filterBy !== "all") {
      filtered = filtered.filter(cv => 
        cv.mainSkills?.includes(filterBy)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case "oldest":
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        case "experience-high":
          return (b.experienceYears || 0) - (a.experienceYears || 0);
        case "experience-low":
          return (a.experienceYears || 0) - (b.experienceYears || 0);
        case "name":
          return (a.fullName || "").localeCompare(b.fullName || "");
        default:
          return 0;
      }
    });

    setFilteredCvs(filtered);
  }, [cvs, searchTerm, sortBy, filterBy]);

  useEffect(() => {
    fetchCvs();
  }, []);

  const LoadingSkeleton = () => (
    <div className="cv-grid">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="cv-card skeleton">
          <div className="cv-card-header skeleton-header">
            <div className="skeleton-avatar"></div>
            <div className="skeleton-info">
              <div className="skeleton-name"></div>
              <div className="skeleton-title"></div>
            </div>
          </div>
          <div className="skeleton-skills"></div>
          <div className="skeleton-experience"></div>
          <div className="skeleton-button"></div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="recommended-cv">
        <div className="recommendations-header">
          <h2 className="brand-section-title">CV ĐỀ XUẤT CHO BRAND</h2>
          <div className="recommendations-controls">
            <div className="search-box skeleton-search"></div>
            <div className="filter-controls">
              <div className="skeleton-select"></div>
              <div className="skeleton-select"></div>
            </div>
          </div>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="recommended-cv">
      <div className="recommendations-header">
        <h2 className="brand-section-title">CV ĐỀ XUẤT CHO BRAND</h2>
        
        <div className="recommendations-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, vị trí, kỹ năng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <svg className="search-icon" viewBox="0 0 24 24" fill="none">
              <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>

          <div className="filter-controls">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="experience-high">Kinh nghiệm cao nhất</option>
              <option value="experience-low">Kinh nghiệm thấp nhất</option>
              <option value="name">Theo tên A-Z</option>
            </select>

            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="filter-select"
            >
              <option value="all">Tất cả kỹ năng</option>
              {skillTags.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredCvs.length === 0 ? (
        <div className="brand-empty-state">
          {cvs.length === 0 ? (
            <>
              <div className="empty-icon">📄</div>
              <h3>Chưa có CV nào được đề xuất</h3>
              <p>Hệ thống sẽ đề xuất CV phù hợp dựa trên nhu cầu của bạn</p>
            </>
          ) : (
            <>
              <div className="empty-icon">🔍</div>
              <h3>Không tìm thấy CV phù hợp</h3>
              <p>Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="results-info">
            <span>Tìm thấy {filteredCvs.length} CV phù hợp</span>
          </div>
          
          <div className="cv-grid">
            {filteredCvs.map((cv) => (
              <div key={cv._id} className="cv-card enhanced">
                <div className="cv-card-header">
                  <div className="cv-avatar">
                    {cv.user?.avatar ? (
                      <img src={cv.user.avatar} alt={cv.user.username} />
                    ) : (
                      <span>
                        {cv.user?.username?.[0]?.toUpperCase() ||
                          cv.fullName?.[0]?.toUpperCase() ||
                          "C"}
                      </span>
                    )}
                  </div>
                  <div className="cv-info">
                    <h3>{cv.fullName}</h3>
                    <p className="cv-title">{cv.title}</p>
                  </div>
                </div>

                <div className="cv-skills">
                  <div className="skills-label">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
                    </svg>
                    Kỹ năng chính:
                  </div>
                  <div className="skills-tags">
                    {cv.mainSkills && cv.mainSkills.length > 0 ? (
                      cv.mainSkills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))
                    ) : (
                      <span className="skill-tag updating">Đang cập nhật</span>
                    )}
                    {cv.mainSkills && cv.mainSkills.length > 3 && (
                      <span className="skill-tag more">+{cv.mainSkills.length - 3}</span>
                    )}
                  </div>
                </div>

                <div className="cv-experience">
                  <div className="experience-item">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M10,2H14A2,2 0 0,1 16,4V6H20A2,2 0 0,1 22,8V19A2,2 0 0,1 20,21H4A2,2 0 0,1 2,19V8A2,2 0 0,1 4,6H8V4A2,2 0 0,1 10,2M14,6V4H10V6H14Z"/>
                    </svg>
                    <span>
                      {cv.experienceYears
                        ? `${cv.experienceYears}+ năm kinh nghiệm`
                        : "Chưa cập nhật kinh nghiệm"}
                    </span>
                  </div>
                </div>

                {/* CV Preview */}
                {cv.cvFileUrl && cv.cvFileType === "image" && (
                  <div className="cv-preview">
                    <img
                      src={cv.cvFileUrl}
                      alt="CV Preview"
                      className="cv-preview-image"
                    />
                    <div className="cv-preview-overlay">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
                      </svg>
                    </div>
                  </div>
                )}

                <Link
                  to={`/brand/recommended/${cv._id}`}
                  className="cv-detail-btn enhanced"
                >
                  Xem CV chi tiết
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"/>
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}


