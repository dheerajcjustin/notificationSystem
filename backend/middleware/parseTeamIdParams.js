import mongoose from "mongoose";

// Middleware function to check if TeamId is a valid ObjectId
export const validateTeamId = (req, res, next) => {
      const { teamId } = req.params;

      // Check if TeamId is a valid ObjectId

      if (!mongoose.isValidObjectId(teamId)) {
            return res.status(400).json({ error: "Invalid TeamId" });
      }

      req.teamId = new mongoose.Types.ObjectId(teamId);

      console.log("teamid", req.teamId);

      // If TeamId is valid, proceed to the next middleware/route handler
      next();
};
