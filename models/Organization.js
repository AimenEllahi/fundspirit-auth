import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
    },
    amount: {
      type: Number,
    },
    transactionHash: {
      type: String,
    },
    vendorName: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const OrganizationSchema = new mongoose.Schema(
  {
    addressHash: {
      type: String,
      required: true,
    },
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
    approveDate: {
      type: Date,
    },
    password: {
      type: String,
    },
    campaigns: {
      type: Array,
      maxLength: 3,
      //max length
    },
    totalFundsDisbursed: {
      type: Number,
      default: 0,
    },
    orders: [OrderSchema],
  },
  { timestamps: true }
);

const organization = mongoose.model("Organization", OrganizationSchema);
export default organization;
