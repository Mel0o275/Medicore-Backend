const express = require("express");
const router = express.Router();
const checkLoginAuth = require("../middleware/checkLoginAuth");


const { getAllOrders, createOrder, updateOrder, deleteOrder } = require("../controllers/ordersController");

router.get("/", checkLoginAuth, getAllOrders);
router.post("/", checkLoginAuth, createOrder);
router.put("/:id", checkLoginAuth, updateOrder);
router.delete("/:id", checkLoginAuth, deleteOrder);

module.exports = router;
