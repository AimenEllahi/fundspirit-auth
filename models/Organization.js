import mongoose from "mongoose";

const OrganizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    secp: {
      type: String,
      required: true,
    },
    secpCert: {
      type: String,
    },
    ceoName: {
      type: String,
      required: true,
    },
    ceoEmail: {
      type: String,
      required: true,
    },
    ceoPhone: {
      type: String,
      required: true,
    },
    goals: {
      type: String,
      required: true,
    },
    requestedBy: {
      type: String,
      required: true,
    },
    foundThrough: {
      type: String,
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const organization = mongoose.model("Organization", OrganizationSchema);
export default organization;
