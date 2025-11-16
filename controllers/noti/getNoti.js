const asyncWrapper = require("../../middleware/asyncWrapper");
const Notification = require("./../../model/noti.model");
const appError = require("../../utils/appError");
const HttpStatus = require("../../utils/httpStatusText");

const getNoti = asyncWrapper(async (req, res, next) => {
  if (!req.user) {
    const error = appError.create(
      "Unauthorized - No user found",
      401,
      HttpStatus.FAIL
    );
    return next(error);
  }

  const userId = req.user._id;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const notifications = await Notification.find({ userId: userId })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  if (!notifications || notifications.length === 0) {
    return res.status(200).json({
      status: HttpStatus.SUCCESS,
      count: 0,
      data: { notifications: [] },
    });
  }

  res.status(200).json({
    status: HttpStatus.SUCCESS,
    count: notifications.length,
    data: { notifications },
  });
});

module.exports = getNoti;
