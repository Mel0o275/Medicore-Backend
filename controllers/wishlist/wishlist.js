const Wishlist = require('../../model/wishlist');

async function recalculateWish(wish) {
    wish.numOfWishItems = wish.products.reduce((sum, p) => sum + p.count, 0);
    wish.totalWishPrice = wish.products.reduce((sum, p) => sum + (p.price * p.count), 0);
    await wish.save();
    return wish;
}

async function getUserWish(req, res) {
    try {
        const userId = req.user?._id;
        let wish = await Wishlist.findOne({ wishOwner: userId });

        if (!wish) {
            return res.status(404).json({ message: "Wishlist not found" });
        }

        await recalculateWish(wish);
        res.status(200).json(wish);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function addUserWish(req, res) {
    try {
        const userId = req.user?._id;
        let wish = await Wishlist.findOne({ wishOwner: userId });

        if (!wish) {
            wish = new Wishlist({
                wishOwner: userId,
                products: []
            });
        }

        const newProduct = req.body;
        wish.products.push({
            product_id: newProduct._id,
            count: 1,
            price: newProduct.price || 0
        });

        await recalculateWish(wish);
        res.status(201).json(wish);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteItemWish(req, res) {
    try {
        const userId = req.user?._id;
        const wish = await Wishlist.findOne({ wishOwner: userId });

        if (!wish) return res.status(404).json({ message: "Wishlist not found" });

        const productId = req.params.id;
        wish.products = wish.products.filter(
            p => p.product_id && p.product_id.toString() !== productId
        );
        await recalculateWish(wish);
        res.status(200).json({ message: "Product deleted successfully", wish });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getUserWish,
    addUserWish,
    deleteItemWish
};
