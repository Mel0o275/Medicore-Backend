const Order = require("../model/ordermodel");

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createOrder = async (req, res) => {
  const { customerName, items, totalPrice } = req.body;

  const newOrder = new Order({
    userId: req.user.id,
    customerName,
    items,
    totalPrice,
  });

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
      updateData.deliveredAt =
        now.getHours().toString().padStart(2, "0") +
        ":" +
        now.getMinutes().toString().padStart(2, "0");
    }

    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

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