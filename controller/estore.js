import Estore from "../models/Estore.js";
import NPO from "../models/Organization.js";

export const placeOrder = async (req, res) => {
    const { npoId, price, quantity } = req.body;
    const sellerId = "sjhkajh";
    
    try {
        const npo = await NPO.findById(npoId);
        const estore = await Estore.create({
        npoId,
        price,
        quantity,
        sellerId: sellerId,
        });
    
        res.status(200).json({ estore });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    }

//to get all orders
export const getOrders = async (req, res) => {
    try {
        const estores = await Estore.find();
        res.status(200).json({ estores });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    }
