const asyncWrapper = require("../../middleware/asyncWrapper");
const User = require("../../model/users");
const appError = require("../../utils/appError");
const HttpStatus = require("../../utils/httpStatusText");
const mongoose = require("mongoose");

const getUser = asyncWrapper(async (req, res, next) => {
  const userId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const error = appError.create("Invalid user ID", 400, HttpStatus.FAIL);
    return next(error);
  }

  const user = await User.findById(userId);

  if (!user) {
    const error = appError.create("User not found", 404, HttpStatus.FAIL);
    return next(error);
  }

  user.password = undefined;

  res.status(200).json({
    status: HttpStatus.SUCCESS,
    data: { user },
  });
});

module.exports = getUser;
