import mongoose from "mongoose";

const EstoresSchema = new mongoose.Schema({
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
    sellerId: {
        type: String,
    },
    transactionhash: {
        type: String,
    },
});

const Estore = mongoose.model("Estore", EstoresSchema);
export default Estore;