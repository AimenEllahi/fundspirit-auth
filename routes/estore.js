import express from "express";
import { placeOrder, getOrders, makePayment } from "../controller/estore.js";

const router = express.Router();

router.post("/placeorder", placeOrder);
router.get("/getorders", getOrders);
router.put("/makepayment/:id", makePayment);

export default router;
