import express from "express";
import { authGuard, roleGuard } from "../../middlewares/auth.middleware.js";
import { getRecommendedCvs } from "./cv.controller.js";

const router = express.Router();

// Brand xem CV đề xuất
router.get("/cv/recommended", authGuard, roleGuard("brand"), getRecommendedCvs);

export default router;


