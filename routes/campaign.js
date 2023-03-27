import express from "express";
import { createCampaign, getCampaigns } from "../controller/campaign.js";
const router = express.Router();

router.post("/createCampaigns", createCampaign);
router.get("/", getCampaigns);

export default router;