import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URLS } from "../config/api.js";

export function RecommendedBrands() {
  const [brands, setBrands] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");
  const [industries, setIndustries] = useState([]);

  const fetchBrands = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        search: searchTerm,
        sort: sortBy,
        industry: filterBy !== "all" ? filterBy : ""
      });

      const res = await axios.get(`${API_URLS.BRANDS}?${params}`);
      setBrands(res.data.brands || []);
      setPagination(res.data.pagination || {});

      // Extract unique industries for filter
      const uniqueIndustries = [...new Set((res.data.brands || []).map(brand => brand.industry).filter(Boolean))];
      setIndustries(uniqueIndustries);

      setCurrentPage(page);
    } catch (err) {
      console.error("Fetch brands error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchBrands(1);
    }, 300);

    return () => clearTimeout(debounceTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, sortBy, filterBy]);

  const LoadingSkeleton = () => (
    <div className="brand-cards-grid">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="brand-card skeleton">
          <div className="skeleton-logo"></div>
          <div className="skeleton-brand-name"></div>
          <div className="skeleton-industry"></div>
          <div className="skeleton-description"></div>
          <div className="skeleton-stats">
            <div className="skeleton-stat"></div>
            <div className="skeleton-stat"></div>
          </div>
          <div className="skeleton-button"></div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="brand-news">
        <div className="recommendations-header">
          <h2 className="brand-section-title">TUYỂN DỤNG ĐỀ XUẤT - DANH SÁCH BRAND</h2>
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
    <div className="brand-news">
      <div className="recommendations-header">
        <h2 className="brand-section-title">TUYỂN DỤNG ĐỀ XUẤT - DANH SÁCH BRAND</h2>
        
        <div className="recommendations-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Tìm kiếm công ty..."
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
              <option value="followers-high">Followers cao nhất</option>
              <option value="followers-low">Followers thấp nhất</option>
              <option value="name">Theo tên A-Z</option>
            </select>

            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="filter-select"
            >
              <option value="all">Tất cả ngành</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {brands.length === 0 ? (
        <div className="brand-empty-state">
          <div className="empty-icon">🏢</div>
          <h3>Không tìm thấy công ty phù hợp</h3>
          <p>Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
        </div>
      ) : (
        <>
          <div className="results-info">
            <span>Tìm thấy {pagination.totalItems || brands.length} công ty</span>
          </div>
          
          <div className="brand-cards-grid">
            {brands.map((brand) => (
              <div key={brand._id} className="brand-card">
                <div className="brand-logo-container">
                  {brand.logo ? (
                    <img
                      src={brand.logo}
                      alt={brand.companyName}
                      className="brand-logo"
                    />
                  ) : (
                    <div className="brand-logo-placeholder">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12,7V3H2V21H22V7H12M6,19H4V17H6V19M6,15H4V13H6V15M6,11H4V9H6V11M6,7H4V5H6V7M10,19H8V17H10V19M10,15H8V13H10V15M10,11H8V9H10V11M10,7H8V5H10V7M20,19H12V17H20V19M20,15H12V13H20V15M20,11H12V9H20V11Z"/>
                      </svg>
                    </div>
                  )}
                </div>

                <h3 className="brand-name">{brand.companyName}</h3>
                
                {brand.industry && (
                  <div className="brand-industry">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
                    </svg>
                    {brand.industry}
                  </div>
                )}

                <p className="brand-description">
                  {brand.description 
                    ? (brand.description.length > 120 
                        ? brand.description.substring(0, 120) + "..." 
                        : brand.description)
                    : "Thương hiệu nước giải khát hàng đầu thế giới, luôn tìm kiếm các Creator sáng tạo để quảng bá sản phẩm."
                  }
                </p>

                <div className="brand-stats">
                  <div className="stat-item">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16,4C16.88,4 17.67,4.5 18,5.26L19,7H20A2,2 0 0,1 22,9V16A2,2 0 0,1 20,18H19.82C19.4,19.15 18.28,20 17,20A3,3 0 0,1 14,17A3,3 0 0,1 17,14C18.28,14 19.4,14.85 19.82,16H20V9H19L18,10.74C17.67,11.5 16.88,12 16,12H8C7.12,12 6.33,11.5 6,10.74L5,9H4V16H4.18C4.6,14.85 5.72,14 7,14A3,3 0 0,1 10,17A3,3 0 0,1 7,20C5.72,20 4.6,19.15 4.18,18H4A2,2 0 0,1 2,16V9A2,2 0 0,1 4,7H5L6,5.26C6.33,4.5 7.12,4 8,4H16M16,6H8L7,7.5L8,9H16L17,7.5L16,6Z"/>
                    </svg>
                    <span>{brand.followers || "500K"} followers</span>
                  </div>
                  
                  {brand.website && (
                    <div className="stat-item">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16.36,14C16.44,13.34 16.5,12.68 16.5,12C16.5,11.32 16.44,10.66 16.36,10H19.74C19.9,10.64 20,11.31 20,12C20,12.69 19.9,13.36 19.74,14M14.59,19.56C15.19,18.45 15.65,17.25 15.97,16H18.92C17.96,17.65 16.43,18.93 14.59,19.56M14.34,14H9.66C9.56,13.34 9.5,12.68 9.5,12C9.5,11.32 9.56,10.65 9.66,10H14.34C14.43,10.65 14.5,11.32 14.5,12C14.5,12.68 14.43,13.34 14.34,14M12,19.96C11.17,18.76 10.5,17.43 10.09,16H13.91C13.5,17.43 12.83,18.76 12,19.96M8,8H5.08C6.03,6.34 7.57,5.06 9.4,4.44C8.8,5.55 8.35,6.75 8,8M5.08,16H8C8.35,17.25 8.8,18.45 9.4,19.56C7.57,18.93 6.03,17.65 5.08,16M4.26,14C4.1,13.36 4,12.69 4,12C4,11.31 4.1,10.64 4.26,10H7.64C7.56,10.66 7.5,11.32 7.5,12C7.5,12.68 7.56,13.34 7.64,14M12,4.03C12.83,5.23 13.5,6.57 13.91,8H10.09C10.5,6.57 11.17,5.23 12,4.03M18.92,8H15.97C15.65,6.75 15.19,5.55 14.59,4.44C16.43,5.07 17.96,6.34 18.92,8M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
                      </svg>
                      <span>Website</span>
                    </div>
                  )}
                </div>

                <Link
                  to={`/creator/recommended/${brand._id}`}
                  className="brand-detail-btn"
                >
                  Xem chi tiết Brand
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"/>
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </>
      )}

      {pagination.totalPages > 1 && (
        <div className="enhanced-pagination">
          <button
            onClick={() => fetchBrands(1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            ‹‹
          </button>
          <button
            onClick={() => fetchBrands(currentPage - 1)}
            disabled={!pagination.hasPrev}
            className="pagination-btn"
          >
            ‹
          </button>
          
          <div className="pagination-info">
            <span>Trang {currentPage} / {pagination.totalPages}</span>
            <span className="total-items">({pagination.totalItems} công ty)</span>
          </div>
          
          <button
            onClick={() => fetchBrands(currentPage + 1)}
            disabled={!pagination.hasNext}
            className="pagination-btn"
          >
            ›
          </button>
          <button
            onClick={() => fetchBrands(pagination.totalPages)}
            disabled={currentPage === pagination.totalPages}
            className="pagination-btn"
          >
            ››
          </button>
        </div>
      )}
    </div>
  );
}

