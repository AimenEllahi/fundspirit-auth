import NPO from "../models/Organization.js";

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
      { isApproved: true },
      { new: true }
    );
    res.status(200).json(organization);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
