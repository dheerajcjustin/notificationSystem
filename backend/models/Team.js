import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
      {
            name: String,
            players: [String],
            coach: String,
      },
      { timestamps: true }
);
const Team = mongoose.model("Team", teamSchema);
export default Team;
