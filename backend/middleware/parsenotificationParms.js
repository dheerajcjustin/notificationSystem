import mongoose from "mongoose";

export const validateTeamId = (req, res, next) => {
      const { notificationId } = req.params;

      if (!mongoose.isValidObjectId(notificationId)) {
            return res.status(400).json({ error: "Invalid TeamId" });
      }

      req.notificationId = new mongoose.Types.ObjectId(notificationId);

      console.log("notificationId", req.notificationId);

      // If TeamId is valid, proceed to the next middleware/route handler
      next();
};
