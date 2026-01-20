const asyncWrapper = require("../../middleware/asyncWrapper");
const User = require("../../model/users");
const appError = require("../../utils/appError");
const HttpStatus = require("../../utils/httpStatusText");

const deleteUser = asyncWrapper(async (req, res, next) => {
  const userId = req.params.id;

  const user = await User.findById(userId);
  if (!user) {
    const error = appError.create("User not found", 404, HttpStatus.FAIL);
    return next(error);
  }

// <<<<<<< HEAD
// =======

// >>>>>>> Malak
  await User.findByIdAndDelete(userId);

  res.status(200).json({
    status: HttpStatus.SUCCESS,
    message: "User deleted successfully",
  });
});

module.exports = deleteUser;
