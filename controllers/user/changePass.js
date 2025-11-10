const asyncWrapper = require("../../middleware/asyncWrapper");
const User = require("../../model/users");
const HttpStatus = require("../../utils/httpStatusText");
const appError = require("../../utils/appError");

const bcrypt = require("bcrypt");

const changePass = asyncWrapper(async (req, res, next) => {
  const { password } = req.body;

  const userId = req.user._id;

  const user = await User.findById(userId);

  if (!user) {
    const error = appError.create("User not found", 404, HttpStatus.FAIL);
    return next(error);
  }

 const isSamePassword = await bcrypt.compare(password, user.password);
  if (isSamePassword) {
    const error = appError.create(
      "New Password is the same as old Password!",
      400,
      HttpStatus.FAIL
    );
    return next(error);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user.password = hashedPassword;
  await user.save();


  // Will delete user for check only !
  res
    .status(201)
    .json({ status: HttpStatus.SUCCESS, data: { user } });
});

module.exports = changePass;
