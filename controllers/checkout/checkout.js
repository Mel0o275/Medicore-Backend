const Address = require('../../model/checkout');

async function getUserOrders(req, res) {
    try {
        const userId = req.user?._id;
        const addresses = await Address.find({ userId });

        res.status(200).json({
            status: "success",
            results: addresses.length,
            data: addresses
        });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
}

async function addUserAddress(req, res) {
    try {
        const userId = req.user?._id;
        const { details, phone, city } = req.body;

        if (!details || !phone || !city) {
            return res.status(400).json({
                status: "fail",
                message: "Please provide details, phone, and city."
            });
        }

        const newAddress = await Address.create({ details, phone, city, userId });
        res.status(201).json({
            status: "success",
            message: "Address added successfully",
            data: newAddress
        });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
}

async function updateUserAddress(req, res) {
    try {
        const userId = req.user?._id;
        const { id } = req.params;

        const updatedAddress = await Address.findOneAndUpdate(
            { _id: id, userId },
            req.body,
            { new: true }
        );

        if (!updatedAddress) {
            return res.status(404).json({
                status: "fail",
                message: "Address not found or not yours"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Address updated successfully",
            data: updatedAddress
        });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
}

async function deleteUserAddress(req, res) {
    try {
        const userId = req.user?._id;
        const { id } = req.params;

        const deleted = await Address.findOneAndDelete({ _id: id, userId });

        if (!deleted) {
            return res.status(404).json({
                status: "fail",
                message: "Address not found or not yours"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Address deleted successfully"
        });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
}

module.exports = {
    getUserOrders,
    addUserAddress,
    updateUserAddress,
    deleteUserAddress
};
