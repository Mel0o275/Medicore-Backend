

const asyncWrapper = require("../../middleware/asyncWrapper");
const User = require("../../model/users");
const appError = require("../../utils/appError");
const HttpStatus = require("../../utils/httpStatusText");
const generateOTP = require("./generateOTP");
const redisClient = require("../../utils/redisClient");

const nodemailer = require("nodemailer");

const sendOTP = asyncWrapper(async (req, res, next) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user)
    return next(appError.create("User not found", 404, HttpStatus.FAIL));

  const otp = generateOTP();

  // save OTP for 3 minutes
  await redisClient.set(`otp:${userId}`, otp, { ex: 180 });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Pharmacy Medicore" <${process.env.EMAIL_USER}>`,
    to: user.email,

    subject: "Your OTP Code",
    html: `
      <h2>Pharmacy Medicore</h2>
      <p>Your OTP code is:</p>
      <h1>${otp}</h1>
      <p>This code expires in 3 minutes. Do not share it.</p>
    `,
  });


  res.status(200).json({
    status: HttpStatus.SUCCESS,
    message: "OTP has been sent to your email",
  });
});

module.exports = sendOTP;
