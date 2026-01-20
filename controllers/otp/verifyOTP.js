const asyncWrapper = require("../../middleware/asyncWrapper");
const redisClient = require("../../utils/redisClient");
const appError = require("../../utils/appError");
const HttpStatus = require("../../utils/httpStatusText");

const verifyOTP = asyncWrapper(async (req, res, next) => {
  const userId = req.user._id;
  const { otp } = req.body;

  const savedOtp = await redisClient.get(`otp:${userId}`);

  if (!savedOtp) return next(appError.create("OTP expired", 400, HttpStatus.FAIL));
  if (savedOtp !== otp) return next(appError.create("Invalid OTP", 400, HttpStatus.FAIL));

  await redisClient.del(`otp:${userId}`);

  res.status(200).json({
    status: HttpStatus.SUCCESS,
    message: "OTP verified successfully",
  });
});

module.exports = verifyOTP;
