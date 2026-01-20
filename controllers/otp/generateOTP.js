const NodemailerHelper = require("nodemailer-otp");
require("dotenv").config();

const helper = new NodemailerHelper(
  process.env.EMAIL_USER,
  process.env.EMAIL_PASS
);

const generateOTP = () => {
  return helper.generateOtp(6);
};

module.exports = generateOTP;
