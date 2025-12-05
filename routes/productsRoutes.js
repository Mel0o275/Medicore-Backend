<<<<<<< HEAD
=======
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  getAllproducts,
  getProduct,
  deleteProduct,
  updateProduct,
  createProduct,
  aliasTopProducts,
  getCategoriesStats,
  getBrandsStats,
} = require("../controllers/productsController");
const checkRoleAuth = require("../middleware/checkRoleAuth");

// where images will be stored till uploaded on cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.route("/best-seller").get(aliasTopProducts, getAllproducts);

router.route("/Categories-stats").get(getCategoriesStats);

router.route("/Brands-stats").get(getBrandsStats);

router
  .route("/")
  .get(getAllproducts)
  .post(upload.array("images", 2), checkRoleAuth("admin"), createProduct);

router
  .route("/:id")
  .get(getProduct)
  .patch(upload.array("images", 2), checkRoleAuth("admin"), updateProduct)
  .delete(checkRoleAuth("admin"), deleteProduct);
module.exports = router;
>>>>>>> 308fbb0e998a734f52ea1ba350117d8ef28248bd
