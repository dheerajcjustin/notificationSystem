// import Notification from "../models/Notification.js";
import Notification from "../models/Notification.js";
import { sendNotification } from "../server.js";
import tryCatch from "../services/tryCatch.js";

export const createNotification = async (notification, io) => {
      const { userId, message } = notification;
      const notificationData = await Notification.create({ userId, message });
      sendNotification(notificationData, userId);
};

export const notificationRead = tryCatch(async (req, res, next) => {
      const { notificationId } = req;

      const notification = await Notification.findByIdAndUpdate(
            notificationId,
            { read: true }
      );
      res.send(notification);
});

export const getNotification = tryCatch(async (req, res, next) => {
      const notifications = await Notification.find({ userId: req.user._id });
      res.send(notifications);
});

export const readAllNotification = tryCatch(async (req, res, next) => {
      return Notification.updateMany({ userId: req.user._id }, { read: true });
});
