const asyncWrapper = require("../../middleware/asyncWrapper");
const Notification = require("./../../model/noti.model");
const appError = require("../../utils/appError");
const HttpStatus = require("../../utils/httpStatusText");

const clearNoti = asyncWrapper(async (req, res, next) => {
  const userId = req.user._id;

  if (!req.user) {
    const error = appError.create(
      "Unauthorized - No user found",
      401,
      HttpStatus.FAIL
    );
    return next(error);
  }

  const notifications = await Notification.find({ userId });
  if (!notifications || notifications.length === 0) {
    const error = appError.create(
      "No notifications to clear",
      404,
      HttpStatus.FAIL
    );
    return next(error);
  }

  await Notification.deleteMany({ userId });

  res.status(200).json({
    status: HttpStatus.SUCCESS,
    message: "All notifications cleared successfully",
  });
});

module.exports = clearNoti;
