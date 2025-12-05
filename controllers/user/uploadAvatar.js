const asyncWrapper = require("../../middleware/asyncWrapper");

const appError = require("../../utils/appError");
const HttpStatus = require("../../utils/httpStatusText");
const User = require("../../model/users");

const cloudinary = require("../../config/cloudinary");

const uploadAvatar = asyncWrapper(async (req, res, next) => {
  const { profilePic } = req.body;
  const userId = req.user?._id;

  if (!req.user) {
    const error = appError.create(
      "Unauthorized - No user found",
      401,
      HttpStatus.FAIL
    );
    return next(error);
  }

  if (!profilePic) {
    const error = appError.create(
      "Profile pic is required",
      400,
      HttpStatus.FAIL
    );
    return next(error);
  }

  const uploadResponse = await cloudinary.uploader.upload(profilePic);
  if (!uploadResponse) {
    const error = appError.create(
      "Profile picture is very big",
      400,
      HttpStatus.FAIL
    );
    return next(error);
  }
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { profilePic: uploadResponse.secure_url },
    { new: true }
  );

  updatedUser.password = undefined;

  res
    .status(201)
    .json({ status: HttpStatus.SUCCESS, data: { user: updatedUser } });
});

module.exports = uploadAvatar;
