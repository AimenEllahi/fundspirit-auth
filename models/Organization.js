import mongoose from "mongoose";

const OrganizationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
        },
        description: {
            type: String,
        },
        address: {
            type: String,
        },
    },
    { timestamps: true }
);

const organization = mongoose.model("Organization", OrganizationSchema);
export default organization;