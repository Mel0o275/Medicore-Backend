const Order = require("../models/ordermodel");

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createOrder = async (req, res) => {
  const { customerName, items, totalPrice } = req.body;
  const newOrder = new Order({ customerName, items, totalPrice });

  try {
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const updateData = { status: req.body.status };

    if (req.body.status === "Order is delivered") {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      updateData.deliveredAt = `${hours}:${minutes}`;
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedOrder)
      return res.status(404).json({ message: "Order is not found" });

    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder)
      return res.status(404).json({ message: "Order is not found" });

    res.json({ message: "Order is cancelled" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
