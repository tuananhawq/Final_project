// BE/src/modules/job/job.route.js
import express from "express";
import { getFeaturedJobs, getJobDetail } from "./job.controller.js";

const router = express.Router();

router.get("/", getFeaturedJobs);
router.get("/:id", getJobDetail);

export default router;