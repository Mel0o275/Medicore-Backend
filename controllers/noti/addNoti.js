const asyncWrapper = require("../../middleware/asyncWrapper");
const Notification = require("./../../model/noti.model");
const appError = require("../../utils/appError");
const HttpStatus = require("../../utils/httpStatusText");

const addNoti = asyncWrapper(async (req, res, next) => {
  if (!req.user) {
    const error = appError.create(
      "Unauthorized - No user found",
      401,
      HttpStatus.FAIL
    );
    return next(error);
  }

  const userId = req.user._id;

  const { title, message, type, status } = req.body;

  if (!title || !message || !type) {
    const error = appError.create(
      "Missing required fields (title, message, type)",
      400,
      HttpStatus.FAIL
    );
    return next(error);
  }

  const notification = await Notification.create({
    userId,
    title,
    message,
    type,
    status,
  });

  res.status(201).json({
    status: HttpStatus.SUCCESS,
    message: "Notification added successfully",
    data: { notification },
  });
});

module.exports = addNoti;
