// BE/src/modules/creator/creator.route.js
import express from "express";
import { getFeaturedCreators, getCreatorDetail } from "./creator.controller.js";

const router = express.Router();

// Public routes
router.get("/", getFeaturedCreators);           // /api/creators
router.get("/:id", getCreatorDetail);           // /api/creators/123abc...

export default router;