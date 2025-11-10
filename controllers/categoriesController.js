const Category = require("../model/CategoriesModel");
const APIFeatures = require("../utils/apiFeatures");

const getAllCategories = async (req, res) => {
  try {
    const features = new APIFeatures(Category.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const categories = await features.query;

    res.status(200).json({
      status: "Success",
      results: categories.length,
      data: { categories },
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: err.message,
    });
  }
};

const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        status: "Failed",
        message: "No category found with that ID",
      });
    }

    res.status(200).json({
      status: "Success",
      data: { category },
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: err.message,
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);

    res.status(201).json({
      status: "Success",
      data: { category: newCategory },
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: err.message,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        status: "Failed",
        message: "No category found with that ID",
      });
    }

    res.status(200).json({
      status: "Success",
      data: { category: updatedCategory },
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: err.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);

    if (!deletedCategory) {
      return res.status(404).json({
        status: "Failed",
        message: "No category found with that ID",
      });
    }

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

module.exports = {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
