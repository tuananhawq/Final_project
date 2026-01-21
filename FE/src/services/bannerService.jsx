import { API_URLS } from "../config/api.js";

// src/services/bannerService.js
export const getBanners = async () => {
  const res = await fetch(`${API_URLS.BANNER}`);

  if (!res.ok) {
    throw new Error("Không thể tải banners");
  }

  const data = await res.json();
  return data.banners;
};
export const getBannerDetail = async (id) => {
  const res = await fetch(`${API_URLS.BANNER}/detail/${id}`);
  if (!res.ok) throw new Error("Không tải được");
  const data = await res.json();
  return data.banner;
};