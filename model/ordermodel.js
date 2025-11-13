const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  items: [
    {
      productName: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  totalPrice: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ["Pending", "Order is on the way", "Order is delivered","Cancelled"], 
    default: "Pending" 
  },
  deliveredAt: { type: String }, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
