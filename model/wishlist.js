const mongoose = require('mongoose');

const wishSchema = new mongoose.Schema({
    wishOwner: {
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

module.exports = mongoose.model("Wishlist", wishSchema);
