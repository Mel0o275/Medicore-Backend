const asyncWrapper = require("../../middleware/asyncWrapper");
const Notification = require("./../../model/noti.model");
const appError = require("../../utils/appError");
const HttpStatus = require("../../utils/httpStatusText");

const deleteNoti = asyncWrapper(async (req, res, next) => {
  const notiId = req.params.id;

  if (!req.user) {
    const error = appError.create(
      "Unauthorized - No user found",
      401,
      HttpStatus.FAIL
    );
    return next(error);
  }
  const userId = req.user._id;

  const notification = await Notification.findOne({ _id: notiId, userId });

  if (!notification) {
    const error = appError.create(
      "Notification not found or not authorized to delete",
      404,
      HttpStatus.FAIL
    );
    return next(error);
  }

  await Notification.deleteOne({ _id: notiId });

  res.status(200).json({
    status: HttpStatus.SUCCESS,
    message: "Notification deleted successfully",
  });
});

module.exports = deleteNoti;
