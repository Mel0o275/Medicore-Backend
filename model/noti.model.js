const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const notificationSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String, 
      required: true,
    },
    status: {
      type: String, 
      default: "info",
    },
  },
  { timestamps: true } 
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
