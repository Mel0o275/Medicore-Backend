const mongoose = require('mongoose');

const wishSchema = new mongoose.Schema({
    wishOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    products: [
        {
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: false
            },
            count: {
                type: Number,
                default: 1
            },
            price: {
                type: Number,
                required: false
            }
        }
    ],
    totalWishPrice: {
        type: Number,
        default: 0
    },
    numOfWishItems: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Wishlist', wishSchema);
