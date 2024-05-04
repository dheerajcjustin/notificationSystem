import Notification from "../models/Notification.js";
import Team from "../models/Team.js";
import User from "../models/User.js";
import tryCatch from "../services/tryCatch.js";
import { createNotification } from "./notificationControll.js";

export const createTeam = tryCatch(async (req, res) => {
      const team = await Team.create(req.body);
      res.json(team);
});

export const getTeams = tryCatch(async (req, res) => {
      const team = await Team.find();
      res.send(team);
});

export const myTeams = tryCatch(async (req, res) => {
      User.aggregate([
            { $match: { _id: req.user._id } },
            { $unwind: "$subscriptions" },
            {
                  $lookup: {
                        as: "myTeams",
                        from: "teams",
                        localField: "subscriptions",
                        foreignField: "_id",
                  },
            },
      ]);
});

export const getTeam = tryCatch(async (req, res) => {
      const team = await Team.findById(req.teamId);
      res.send(team);
});

export const addTeamsMember = tryCatch(async (req, res) => {
      const { teamId } = req;
      const { player } = req.body;

      const team = await Team.findByIdAndUpdate(teamId, {
            $addToSet: { players: player },
      });
      const users = await User.find({ subscriptions: team._id });
      console.log({ users });
      const notificationPromise = users.map((user) =>
            createNotification(
                  {
                        userId: user._id,
                        message: `new player is added${player}`,
                  },
                  req.io
            )
      );
      Promise.all(notificationPromise);

      res.send(team);
});

export const removeTeamMember = tryCatch(async (req, res) => {
      const { teamId } = req;
      const { player } = req.body;
      const team = await Team.findByIdAndUpdate(teamId, {
            $pull: { players: player },
      });
      const notificationPromise = users.map((user) =>
            createNotification(
                  {
                        userId: user._id,
                        message: `new player is removed`,
                  },
                  req.io
            )
      );
      Promise.all(notificationPromise);
      res.send(team);
});

export const deleteTeam = tryCatch(async (req, res) => {
      const { teamId } = req;
      const team = await Team.findByIdAndDelete(teamId);
      res.send(team);
});

export const subscribeToTeam = tryCatch(async (req, res, next) => {
      const team = await Team.findById(req.teamId);
      console.log("hai working", team, req.teamId, req?.user?._id);

      const user = await User.findByIdAndUpdate(req?.user?._id, {
            $addToSet: { subscriptions: team._id },
      });

      res.send(team);
});

export const unSubscribeToTeam = tryCatch(async (req, res, next) => {
      const team = await Team.findById(req.teamId);

      const user = await User.findByIdAndUpdate(req?.user?._id, {
            $pull: { subscriptions: team._id },
      });

      res.send(team);
});
