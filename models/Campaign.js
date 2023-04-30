import mongoose from "mongoose";

const CampaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    subtitle: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    image: {
      type: String,
    },
    tags: {
      type: Array,
    },
    address: {
      type: String,
      require: true,
    },
    enrolledNPOs: {
      type: Array,
    },
    lastDisburse: {
      type: Date,
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    supports: {
      type: Array,
    },
  },
  { timestamps: true }
);

const campaign = mongoose.model("Campaign", CampaignSchema);
export default campaign;
