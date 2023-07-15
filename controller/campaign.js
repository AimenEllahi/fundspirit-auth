import Campaign from "../models/Campaign.js";
import fs from "fs";
import util from "util";
import { createError } from "../Utilities/Error.js";
import { uploadFile, getFileStream, deleteFile } from "../Services/S3.js";
import deployContract from "../Utilities/Deployments/Campaign.js";

const unlinkFile = util.promisify(fs.unlink);

//Uses ID to download images from s3 bucket
export const getImage = async (req, res, next) => {
  const key = req.params.id;

  //if key no provided
  if (key == "undefined") return next(createError(404, "Image not found"));

  //download image and render it
  try {
    const readStream = getFileStream(key);
    readStream
      .on("error", (err) => {
        next(createError(404, "Image not found"));
      })
      .pipe(res);
  } catch (error) {
    next(error);
  }
};

//to create campaigns
export const createCampaign = async (req, res) => {
  const { name, description, tags, subtitle, goals } = req.body;

  try {
    //development
    const address = await deployContract();

    //upload image to s3
    let result = await uploadFile(req.file);

    //deletes the file from local storage
    await unlinkFile(req.file.path);

    const newCampaign = new Campaign({
      name,
      description,
      tags,
      subtitle,
      image: result.Key,
      address,
      goals,
    });
    await newCampaign.save();

    res.status(201).json(newCampaign);
  } catch (error) {
    console.log(error.message);
    res.status(409).json({ message: error.message });
  }
};

//to get all campaigns
export const getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.status(200).json(campaigns);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
//to get  campaign
export const getCampaign = async (req, res) => {
  const { id } = req.params;
  try {
    const campaign = await Campaign.findById(id);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    res.status(200).json(campaign);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const fundCampaign = async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  try {
    const campaign = await Campaign.findById(id);
    if (!campaign) {
      return res.status(404).send("Campaign not found");
    }
    await Campaign.findByIdAndUpdate(
      id,
      { totalFundings: Number(campaign?.totalFundings) + Number(amount) },
      { new: true }
    );
  } catch (error) {
    console.log(error);
  }
};

export const deleteAll = async (req, res) => {
  try {
    await Campaign.deleteMany();
    res.status(200).json({ message: "All campaigns deleted" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

//add supported
//Like campaign
//remove like
