const express = require("express");
const router = express.Router();

const checkLoginAuth = require("../middleware/checkLoginAuth");

const sendOTP = require("../controllers/otp/sendOTP");
const verifyOTP = require("../controllers/otp/verifyOTP");

router.route("/send-otp").post(checkLoginAuth, sendOTP);
router.route("/verify-otp").post(checkLoginAuth, verifyOTP);

module.exports = router;
