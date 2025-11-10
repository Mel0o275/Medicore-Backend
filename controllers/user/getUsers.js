const asyncWrapper = require("../../middleware/asyncWrapper");
const User = require("../../model/users");
const appError = require("../../utils/appError");
const HttpStatus = require("../../utils/httpStatusText");

const getUsers = asyncWrapper(async (req, res, next) => {


  // If exist too many users on the system
  
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const users = await User.find({}).skip(skip).limit(limit);

  if (!users || users.length === 0) {
    const error = appError.create("No users found", 404, HttpStatus.FAIL);
    return next(error);
  }

  res.status(200).json({
    status: HttpStatus.SUCCESS,
    data: { users },
  });
});

module.exports = getUsers;
