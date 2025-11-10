const express = require("express");
const categoryController = require("../controllers/categoriesController");
const checkRoleAuth = require("../middleware/checkRoleAuth");
const router = express.Router();

router
  .route("/")
  .get(categoryController.getAllCategories)
  .post(checkRoleAuth("admin"), categoryController.createCategory);

router
  .route("/:id")
  .get(categoryController.getCategory)
  .patch(checkRoleAuth("admin"), categoryController.updateCategory)
  .delete(checkRoleAuth("admin"), categoryController.deleteCategory);

module.exports = router;
