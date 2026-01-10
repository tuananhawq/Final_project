import express from "express";
import { authGuard, roleGuard } from "../../middlewares/auth.middleware.js";
import {
  createCreatorCv,
  getCreatorCv,
  updateCreatorCv,
  deleteCreatorCv,
} from "./creatorCv.controller.js";

const router = express.Router();

// Tất cả route đều yêu cầu authGuard + roleGuard("creator")
router.post("/creator/cv", authGuard, roleGuard("creator"), createCreatorCv);
router.get("/creator/cv", authGuard, roleGuard("creator"), getCreatorCv);
router.put("/creator/cv", authGuard, roleGuard("creator"), updateCreatorCv);
router.delete("/creator/cv", authGuard, roleGuard("creator"), deleteCreatorCv);

export default router;

