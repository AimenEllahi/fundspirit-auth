import mongoose from "mongoose";

const CampaignSchema = new mongoose.Schema(
  {
    name: {
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
  },
  { timestamps: true }
);

const campaign = mongoose.model("Campaign", CampaignSchema);
export default campaign;
