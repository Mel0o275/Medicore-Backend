const Cart = require('../../model/cart');
const Product = require('../../model/Product');

async function recalculateCart(cart) {
    // cart.numOfCartItems = cart.products.reduce((sum, p) => sum + p.count, 0);
    // cart.totalCartPrice = cart.products.reduce((sum, p) => sum + (p.price * p.count), 0);
    await cart.save();
    return cart;
}

async function getUserCart(req, res) {
    try {
        const userId = req.user?._id;

        let cart = await Cart.findOne({ cartOwner: userId })
            .populate({ path: "products.product_id", select: "title price images" })
            .lean();

        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.products = cart.products.map(p => ({
            product_id: p.product_id?._id,
            title: p.product_id?.title,
            price: p.price,
            count: p.count,
            images: p.product_id?.images
        }));

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function addUserCart(req, res) {
    try {
        const userId = req.user?._id;
        let cart = await Cart.findOne({ cartOwner: userId });
        if (!cart) {
            cart = await Cart.create({ cartOwner: userId, products: [] });
        }

        const newProduct = await Product.findById(req.body._id);
        if (!newProduct) return res.status(404).json({ message: "Product not found" });

        const existingProduct = cart.products.find(
            p => p.product_id.toString() === newProduct._id.toString()
        );

        if (existingProduct) {
            existingProduct.count += 1;
        } else {
            cart.products.push({
                product_id: newProduct._id,
                count: 1,
                price: newProduct.price
            });
        }

        await recalculateCart(cart);

        const populatedCart = await Cart.findById(cart._id)
            .populate({ path: "products.product_id", select: "title price images" })
            .lean();

        populatedCart.products = populatedCart.products.map(p => ({
            product_id: p.product_id?._id,
            title: p.product_id?.title,
            price: p.price,
            count: p.count,
            images: p.product_id?.images
        }));

        res.status(201).json(populatedCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteItemCart(req, res) {
    try {
        const userId = req.user?._id;
        const cart = await Cart.findOne({ cartOwner: userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const productId = req.params.id;
        cart.products = cart.products.filter(
            p => p.product_id.toString() !== productId
        );

        await recalculateCart(cart);
        res.status(200).json({ message: "success" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateUserCart(req, res) {
    try {
        const userId = req.user?._id;
        const cart = await Cart.findOne({ cartOwner: userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const productId = req.params.id;
        const operator = req.params.operator;
        const product = cart.products.find(p => p.product_id.toString() === productId);

        if (!product) return res.status(404).json({ message: "Product not found" });

        if (operator === '+') {
            product.count += 1;
        } else if (operator === '-') {
            if (product.count > 1) {
                product.count -= 1;
            } else {
                cart.products = cart.products.filter(p => p.product_id.toString() !== productId);
            }
        } else {
            return res.status(400).json({ message: "Invalid operator. Use '+' or '-'." });
        }

        await recalculateCart(cart);

        const populatedCart = await Cart.findById(cart._id)
            .populate({ path: "products.product_id", select: "title price images" })
            .lean();

        populatedCart.products = populatedCart.products.map(p => ({
            product_id: p.product_id?._id,
            title: p.product_id?.title,
            price: p.price,
            count: p.count,
            images: p.product_id?.images
        }));

        res.status(200).json({ message: "success", cart: populatedCart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function clearUserCart(req, res) {
    try {
        const userId = req.user?._id;
        const cart = await Cart.findOne({ cartOwner: userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.products = [];
        await recalculateCart(cart);
        res.status(200).json({ message: "success" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getUserCart,
    addUserCart,
    deleteItemCart,
    updateUserCart,
    clearUserCart
};
