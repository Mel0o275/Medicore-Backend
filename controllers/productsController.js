const fs = require("fs");
const path = require("path");
const cloudinary = require("../config/cloudinary");
const Product = require("../model/ProductsModel");
const APIFeatures = require("../utils/apiFeatures");
const aliasTopProducts = (req, res, next) => {
  req.aliasQuery = {
    limit: "8",
    sort: "-ratings,price",
  };
  next();
};
const getAllproducts = async (req, res) => {
  try {
    const reqQuery = req.aliasQuery || req.query;
    const features = new APIFeatures(Product.find(), reqQuery)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const products = await features.query;

    if (products.length === 0) {
      return res.status(404).json({
        status: "Failed",
        message: "No products found for the given filters.",
      });
    }

    res.status(200).json({
      status: "Sucess",
      results: products.length,
      data: { products },
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: err,
    });
  }
};
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: "Failed",
        message: "Product not found",
      });
    }

    res.status(200).json({
      status: "Sucess",
      data: { product },
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: "Invalid ID or bad request",
    });
  }
};
const createProduct = async (req, res) => {
  try {
    const images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "products",
        });
        fs.unlinkSync(file.path);
        images.push({ url: result.secure_url, public_id: result.public_id });
      }
    }

    const newProduct = await Product.create({
      ...req.body,
      images,
    });

    res.status(201).json({
      status: "Success",
      product: newProduct,
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: err.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ status: "Failed", message: "Product not found" });
    }

    let updatedImages = product.images || [];

    if (req.files && req.files.length > 0) {
      if (updatedImages.length > 0) {
        for (const img of updatedImages) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }

      updatedImages = [];

      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "products",
        });
        fs.unlinkSync(file.path);
        updatedImages.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    let updateData = { ...req.body, images: updatedImages };

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: "Success",
      data: { updatedProduct },
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: err.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ status: "Failed", message: "Product not found to be deleted" });
    }

    if (product.images && product.images.length > 0) {
      for (const img of product.images) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "Success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: err.message,
    });
  }
};
const getCategoriesStats = async (req, res) => {
  try {
    const stats = await Product.aggregate([
      {
        $match: { price: { $gte: 5 } },
      },
      {
        $group: {
          _id: "$category",
          numproducts: { $sum: 1 },
          minPrice: { $min: "$price" },
          avgRating: { $avg: "$ratings" },
          maxPrice: { $max: "$price" },
          avgPrice: { $avg: "$price" },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
    ]);
    res.status(200).json({
      status: "Sucess",
      results: stats.length,
      data: { stats },
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: err,
    });
  }
};
const getBrandsStats = async (req, res) => {
  try {
    const stats = await Product.aggregate([
      {
        $match: { price: { $gte: 5 } },
      },
      {
        $group: {
          _id: "$brand",
          numproducts: { $sum: 1 },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
          avgRating: { $avg: "$ratings" },
          avgPrice: { $avg: "$price" },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
    ]);
    res.status(200).json({
      status: "Sucess",
      results: stats.length,
      data: { stats },
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: err,
    });
  }
};

module.exports = {
  getAllproducts,
  getProduct,
  deleteProduct,
  updateProduct,
  createProduct,
  aliasTopProducts,
  getCategoriesStats,
  getBrandsStats,
};
