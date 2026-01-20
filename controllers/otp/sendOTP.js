const asyncWrapper = require("../../middleware/asyncWrapper");
const User = require("../../model/users");
const appError = require("../../utils/appError");
const HttpStatus = require("../../utils/httpStatusText");
const generateOTP = require("./generateOTP");
const redisClient = require("../../utils/redisClient");

const NodemailerHelper = require("nodemailer-otp");
require("dotenv").config();

const helper = new NodemailerHelper(
  process.env.EMAIL_USER,
  process.env.EMAIL_PASS,
);
const sendOTP = asyncWrapper(async (req, res, next) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user)
    return next(appError.create("User not found", 404, HttpStatus.FAIL));

  if (!redisClient.isOpen) {
    await redisClient.connect();
  }

  const otp = generateOTP();

  await redisClient.set(`otp:${userId}`, otp, { EX: 180 });

  await helper.sendEmail(
    user.email,
    "Pharmacy Medicore",
    `Your OTP is send. Do not share it. It expires in 3 minute.`,
    otp,
  );

  res.status(200).json({
    status: HttpStatus.SUCCESS,
    message: "An OTP has been sent.",
  });
});

module.exports = sendOTP;
