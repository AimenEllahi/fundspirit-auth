import express from 'express';
import {
    placeOrder,
    getOrders
} from "../controller/estore.js";

const router = express.Router();

router.post("/placeorder", placeOrder);
router.get("/getorders", getOrders);

export default router;