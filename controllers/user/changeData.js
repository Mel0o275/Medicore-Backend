
const asyncWrapper = require("../../middleware/asyncWrapper");
const User = require("../../model/users");
const HttpStatus = require("../../utils/httpStatusText");
const appError = require("../../utils/appError");

const changeData = asyncWrapper(async (req, res, next) => {
  const {
    firstName,
    secondName,
    email,
    phoneNumber,
    dateOfBirth,
    gender,
    role,
  } = req.body;

  const userId = req.user._id;

  const user = await User.findById(userId);

  if (!user) {
    const error = appError.create("User not found", 404, HttpStatus.FAIL);
    return next(error);
  }

  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    // If the user not change the email , the system not make him to change because it exist in the system
    if (existingUser && existingUser._id.toString() !== user._id.toString()) {
      const error = appError.create(
        "Email already in use by another user",
        400,
        HttpStatus.FAIL
      );
      return next(error);
    }
  }

  user.firstName = firstName || user.firstName;
  user.secondName = secondName || user.secondName;
  user.email = email || user.email;
  user.phoneNumber = phoneNumber || user.phoneNumber;
  user.dateOfBirth = dateOfBirth || user.dateOfBirth;
  user.role = role || user.role;
  user.gender = gender || user.gender;

  await user.save();

  user.password = undefined;

  res.status(200).json({
    status: "SUCCESS",
    message: "Successfully updated data",
    data: { user },
  });
});

module.exports = changeData;
