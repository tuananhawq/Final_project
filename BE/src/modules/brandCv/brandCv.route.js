import express from "express";
import { authGuard, roleGuard } from "../../middlewares/auth.middleware.js";
import {
  createBrandCv,
  getBrandCvs,
  updateBrandCv,
  deleteBrandCv,
} from "./brandCv.controller.js";

const router = express.Router();

router.post("/brand/cv", authGuard, roleGuard("brand"), createBrandCv);
router.get("/brand/cv", authGuard, roleGuard("brand"), getBrandCvs);
router.put("/brand/cv/:id", authGuard, roleGuard("brand"), updateBrandCv);
router.delete("/brand/cv/:id", authGuard, roleGuard("brand"), deleteBrandCv);

export default router;


