const Wishlist = require("../../model/wishlist");
const Product = require("../../model/ProductsModel");

async function recalculateWish(wish) {
    await wish.save();
    return wish;
}

async function getUserWish(req, res) {
    try {
        const userId = req.user?._id;

        let wish = await Wishlist.findOne({ wishOwner: userId })
            .populate({ path: "products.product_id", select: "title price images" })
            .lean();

        if (!wish) return res.status(404).json({ message: "Wishlist not found" });

        wish.products = wish.products.map((p) => ({
            product_id: p.product_id?._id,
            title: p.product_id?.title,
            price: p.price,
            count: p.count,
            images: p.product_id?.images,
        }));

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
            wish = await Wishlist.create({ wishOwner: userId, products: [] });
        }

        const newProduct = await Product.findById(req.body._id);
        if (!newProduct)
            return res.status(404).json({ message: "Product not found" });

        const existingProduct = wish.products.find(
            (p) => p.product_id.toString() === newProduct._id.toString()
        );

        if (existingProduct) {
            return res.status(400).json({ message: "Product already in wishlist" });
        }

        wish.products.push({
            product_id: newProduct._id,
            count: 1,
            price: newProduct.price,
        });

        await recalculateWish(wish);

        const populatedWish = await Wishlist.findById(wish._id)
            .populate({ path: "products.product_id", select: "title price images" })
            .lean();

        populatedWish.products = populatedWish.products.map((p) => ({
            product_id: p.product_id?._id,
            title: p.product_id?.title,
            price: p.price,
            count: p.count,
            images: p.product_id?.images,
        }));

        res.status(201).json(populatedWish);
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
            (p) => p.product_id.toString() !== productId
        );

        await recalculateWish(wish);
        res.status(200).json({ message: "success" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function clearUserWish(req, res) {
    try {
        const userId = req.user?._id;
        const wish = await Wishlist.findOne({ wishOwner: userId });
        if (!wish) return res.status(404).json({ message: "Wishlist not found" });

        wish.products = [];
        await recalculateWish(wish);
        res.status(200).json({ message: "success" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getUserWish,
    addUserWish,
    deleteItemWish,
    clearUserWish,
};
