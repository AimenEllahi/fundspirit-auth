import mongoose from "mongoose";

const EstoresSchema = new mongoose.Schema(
  {
    //price, productid, quantity, npoid, date, sellerid, transactionhash
    price: {
      type: Number,
    },
    productid: {
      type: String,
    },
    quantity: {
      type: Number,
    },
    npoId: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    vendor: {
      type: String,
    },
    transactionHash: {
      type: String,
      default: null,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    orderStatus: {
      type: String,
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Estore = mongoose.model("Estore", EstoresSchema);
export default Estore;
