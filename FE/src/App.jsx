import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Admin from "./pages/Admin.jsx";
import BlogList from "./pages/BlogList.jsx";
import BlogDetail from "./pages/BlogDetail.jsx";
import Profile from "./pages/Profile.jsx";
import About from "./pages/About.jsx";
import CreatorPage from "./pages/CreatorPage.jsx";
import CreatorLayout from "./pages/creator/CreatorLayout.jsx";
import CreatorNewsPage from "./pages/creator/CreatorNewsPage.jsx";
import CreatorRecommendedPage from "./pages/creator/CreatorRecommendedPage.jsx";
import CreatorCVPage from "./pages/creator/CreatorCVPage.jsx";
import CreatorApplicationsPage from "./pages/creator/CreatorApplicationsPage.jsx";
import BrandLayout from "./pages/brand/BrandLayout.jsx";
import BrandNewsPage from "./pages/brand/BrandNewsPage.jsx";
import BrandRecommendedPage from "./pages/brand/BrandRecommendedPage.jsx";
import BrandCVPage from "./pages/brand/BrandCVPage.jsx";
import BrandMyNewsPage from "./pages/brand/BrandMyNewsPage.jsx";
import JobDetailPage from "./pages/JobDetailPage.jsx";
import HighlightDetail from "./pages/HighlightDetail.jsx";
import JobOffersPage from "./pages/JobOffersPage.jsx";
import AgencyDetailPage from "./pages/AgencyDetailPage.jsx";
import CreatorDetailPage from "./pages/CreatorDetailPage.jsx";
import TopicDetailPage from "./pages/TopicDetailPage.jsx";
import TestimonialDetailPage from "./pages/TestimonialDetailPage.jsx";
import JobPostDetailPage from "./pages/JobPostDetailPage.jsx";
import CVDetailPage from "./pages/CVDetailPage.jsx";
import BrandDetailPage from "./pages/BrandDetailPage.jsx";
import Pricing from "./pages/Pricing.jsx";
import Legal from "./pages/Legal.jsx";
import CheckoutSuccess from "./pages/CheckoutSuccess.jsx";

export default function App() {
  return (
    <Routes>
      {/* Guest Home */}
      <Route path="/" element={<Home />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/profile" element={<Profile />} />

      {/* User pages */}
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/services" element={<Pricing />} />
      <Route path="/checkout/success" element={<CheckoutSuccess />} />
      <Route path="/legal" element={<Legal />} />
      <Route path="/terms" element={<Legal />} />
      <Route path="/privacy" element={<Legal />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/highlight/:id" element={<HighlightDetail />} />
      <Route path="/agency/:id" element={<AgencyDetailPage />} />
      <Route path="/creator-detail/:id" element={<CreatorDetailPage />} />
      <Route path="/topic/:id" element={<TopicDetailPage />} />
      <Route path="/testimonial/:id" element={<TestimonialDetailPage />} />
      
      {/* Creator routes với nested routing */}
      <Route path="/creator" element={<CreatorLayout />}>
        <Route index element={<Navigate to="/creator/news" replace />} />
        <Route path="news" element={<CreatorNewsPage />} />
        <Route path="news/:id" element={<JobPostDetailPage />} />
        <Route path="recommended" element={<CreatorRecommendedPage />} />
        <Route path="recommended/:id" element={<BrandDetailPage />} />
        <Route path="cv" element={<CreatorCVPage />} />
        <Route path="applications" element={<CreatorApplicationsPage />} />
      </Route>
      
      {/* Brand routes với nested routing */}
      <Route path="/brand" element={<BrandLayout />}>
        <Route index element={<Navigate to="/brand/news" replace />} />
        <Route path="news" element={<BrandNewsPage />} />
        <Route path="news/:id" element={<JobPostDetailPage />} />
        <Route path="recommended" element={<BrandRecommendedPage />} />
        <Route path="recommended/:id" element={<CVDetailPage />} />
        <Route path="cv" element={<BrandCVPage />} />
        <Route path="mynews" element={<BrandMyNewsPage />} />
        <Route path="mynews/:id" element={<JobPostDetailPage />} />
      </Route>

      <Route path="/job-offers" element={<JobOffersPage />} />
      <Route path="/job/:id" element={<JobDetailPage />} />
      {/* Blog */}
      <Route path="/blog" element={<BlogList />} />
      <Route path="/blog/:id" element={<BlogDetail />} />
    </Routes>
  );
}
