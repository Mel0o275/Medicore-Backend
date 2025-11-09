const mongoose = require('mongoose');

const checkoutSchema = new mongoose.Schema({
    details: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }
});

module.exports = mongoose.model('Checkout', checkoutSchema);
