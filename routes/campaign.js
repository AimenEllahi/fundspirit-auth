import express from "express";
import {
  createCampaign,
  getCampaigns,
  deleteAll,
  getCampaign,
  fundCampaign,
  getImage,
} from "../controller/campaign.js";
import auth from "../middlewares/auth.js";
import admin from "../middlewares/admin.js";
import { upload, checkFileType } from "../middlewares/Image.js";

const router = express.Router();

// router.post(
//   "/create",
//   upload.single("image"),
//   auth,
//   admin,
//   checkFileType,
//   createCampaign
// );
router.post("/create", createCampaign);
router.get("/images/:id", getImage);
router.get("/", getCampaigns);
router.get("/:id", getCampaign);
router.put("/fund/:id", fundCampaign);

export default router;
