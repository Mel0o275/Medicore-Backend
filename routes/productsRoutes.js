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
    cb(null, "tmp");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    // handling uploading more than one image at a time with adding this unique value
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `product-${unique}.${ext}`);
  },
});

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
