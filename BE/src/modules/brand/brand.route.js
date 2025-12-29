// BE/src/modules/brand/brand.route.js
import express from "express";
import { getFeaturedBrands, getBrandDetail } from "./brand.controller.js";

const router = express.Router();

router.get("/", getFeaturedBrands);
router.get("/:id", getBrandDetail);

export default router;