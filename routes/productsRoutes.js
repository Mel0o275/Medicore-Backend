const express = require("express");
const router = express.Router();
const multer = require("multer");

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
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/img");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    // handling uploading more than one image at a time with adding this unique value
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `product-${unique}.${ext}`);
  },
});

const upload = multer({ storage });

// get best seller products
router.route("/best-seller").get(aliasTopProducts, getAllproducts);

// get product statistics by categories
router.route("/Categories-stats").get(getCategoriesStats);

// get product statistics by brands
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
