const express = require("express");
const router = express.Router();

// Middleware

// const protectRoute = require("../lib/verifyToken");

// Noti Controllers
const addNoti = require("../controllers/noti/addNoti");
const getNoti = require("../controllers/noti/getNoti");
const deleteNoti = require("../controllers/noti/deleteNoti");
const clearNoti = require("../controllers/noti/clearNoti");

const checkLoginAuth = require("../middleware/checkLoginAuth");

// Protected routes (need token)
router.route("/add-noti").post(checkLoginAuth, addNoti);
router.route("/get-noti").get(checkLoginAuth, getNoti);
router.route("/delete-noti/:id").delete(checkLoginAuth, deleteNoti);
router.route("/clear-noti").delete(checkLoginAuth, clearNoti);

module.exports = router;
