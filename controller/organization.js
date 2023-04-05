import NPO from "../models/Organization.js";
import Campaign from "../models/Campaign.js";
import bcrypt from "bcryptjs";

export const createOrganization = async (req, res) => {
  const {
    name,
    category,
    email,
    address,
    website,
    description,
    logo,
    coverImage,
    secp,
    secpCert,
    ceoName,
    ceoEmail,
    ceoPhone,
    goals,
    requestedBy,
    foundThrough,
  } = req.body;

  try {
    const newOrganization = new NPO({
      name,
      category,
      email,
      address,
      website,
      description,
      logo,
      coverImage,
      secp,
      secpCert,
      ceoName,
      ceoEmail,
      ceoPhone,
      goals,
      requestedBy,
      foundThrough,
    });
    await newOrganization.save();
    console.log(newOrganization);
    res.status(201).json(newOrganization);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getOrganizations = async (req, res) => {
  try {
    const organizations = await NPO.find({ isApproved: true });
    res.status(200).json(organizations);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getOrganizationRequests = async (req, res) => {
  try {
    const organizations = await NPO.find({ isApproved: false });
    res.status(200).json(organizations);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getNPO = async (req, res) => {
  const { id } = req.params;
  try {
    const organization = await NPO.findById(id);
    console.log(organization);
    res.status(200).json(organization);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const approveNPO = async (req, res) => {
  const { id } = req.params;
  try {
    const organization = await NPO.findByIdAndUpdate(
      id,
      { isApproved: true, approveDate: new Date().toISOString() },
      { new: true }
    );
    res.status(200).json(organization);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const passwordView = (req, res) => {
  const { id } = req.params;
  console.log(id);
  // Node.js code
  const errorMessage = "";
  res.render("createPassword", { errorMessage, id });
};

export const setPassword = async (req, res) => {
  const { password, confirmPassword } = req.body;
  const { id } = req.params;
  if (password !== confirmPassword) {
    res.render("createPassword", { errorMessage: "Passwords do not match" });
  } else {
    try {
      const hashedPassword = await bcrypt.hashSync(password, 10);
      console.log(hashedPassword);
      const npo = await NPO.findByIdAndUpdate(
        id,
        { password: hashedPassword },
        { new: true }
      );
      res.status(200).json(npo);
    } catch (error) {
      console.log(error);
    }
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const npo = await NPO.findOne({ email: email });
    console.log(npo);
    if (!npo) {
      console.log("not found");
      res.status(404).json({ message: "NPO not found" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, npo.password);
    if (!isPasswordCorrect) {
      console.log("here");
      res.status(400).json({ message: "Invalid credentials" });
    }
    console.log(npo);
    res.status(200).json(npo);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const enrollCampaign = async (req, res) => {
  const { id, campaignId } = req.body;
  console.log(id, campaignId);
  try {
    const existingNPO = await NPO.findById(id);
    const existingCampaign = await Campaign.findById(campaignId);
    if (!existingNPO) return res.status(404).json({ message: "NPO not found" });
    if (existingNPO.campaigns.includes(campaignId))
      return res.status(400).json({ message: "Already enrolled" });
    if (existingNPO.campaigns.length >= 3)
      return res
        .status(400)
        .json({ message: "You can only enroll in 3 campaigns" });
    if (!existingCampaign)
      return res.status(404).json({ message: "Campaign not found" });

    const updatedNPO = await NPO.findByIdAndUpdate(
      id,
      {
        campaigns: [...existingNPO.campaigns, campaignId],
      },
      {
        new: true,
      }
    );

    await Campaign.findByIdAndUpdate(
      campaignId,
      {
        enrolledNPOs: [...existingCampaign.enrolledNPOs, id],
      },
      {
        new: true,
      }
    );

    res.status(200).json(updatedNPO);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const unEnroll = async (req, res) => {
  const { id } = req.params;
  try {
    await NPO.findByIdAndUpdate(id, {
      campaigns: [],
    });
    res.status(200).json({ message: "Unenrolled" });
  } catch (err) {
    console.log(err);
  }
};
