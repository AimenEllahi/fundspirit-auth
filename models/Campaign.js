import mongoose from "mongoose";

const CampaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    description: {
      type: String,
    },
    image: { 
        type: String,
    },
    tags: {
        type: Array,
    },
    },
  { timestamps: true }

);


const campaign = mongoose.model("Campaign", CampaignSchema);
export default campaign;
