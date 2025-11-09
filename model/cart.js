const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
    cartOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // required: true
    },
    products: [
        {
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            count: { type: Number, default: 1 },
            price: { type: Number, required: true }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("Cart", cartSchema);
