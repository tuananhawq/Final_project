// src/services/bannerService.js
export const getBanners = async () => {
  const res = await fetch("http://localhost:3000/api/banners");

  if (!res.ok) {
    throw new Error("Không thể tải banners");
  }

  const data = await res.json();
  return data.banners;
};
export const getBannerDetail = async (id) => {
  const res = await fetch(`http://localhost:3000/api/banners/detail/${id}`);
  if (!res.ok) throw new Error("Không tải được");
  const data = await res.json();
  return data.banner;
};