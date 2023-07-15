import Estore from "../models/Estore.js";
import NPO from "../models/Organization.js";

export const placeOrder = async (req, res) => {
  const { npoId, price, quantity, vendor } = req.body;

  try {
    const npo = await NPO.findById(npoId);

    if (!npo) {
      return res.status(404).json({ message: "NPO not found" });
    }

    const order = await Estore.create({
      npoId,
      price,
      quantity,
      vendor,
    });

    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//to get all orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Estore.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//to pay for an order
export const makePayment = async (req, res) => {
  const { id } = req.params;
  const { transactionHash } = req.body;
  console.log(transactionHash);
  try {
    const order = await Estore.findByIdAndUpdate(
      id,
      { transactionHash: transactionHash, isPaid: true },
      { new: true }
    );

    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const completeOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Estore.findByIdAndUpdate(
      id,
      { orderStats: "Complete" },
      { new: true }
    );

    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Estore.findByIdAndUpdate(
      id,
      { orderStats: "Canceled" },
      { new: true }
    );

    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
