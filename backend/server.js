import "dotenv/config";

import express from "express";
import cors from "cors";
import mongooseConnect from "./config/mongooseConnect.js";
import teamRoutes from "./routes/teamRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import userRouter from "./routes/userRoutes.js";
import morgan from "morgan";
const server = express();
import cookieParser from "cookie-parser";
import notificationRoutes from "./routes/notificationRoutes.js";
import http from "http";
const connectedSockets = {};

import jwt from "jsonwebtoken";

import { Server as socketServer } from "socket.io";

const PORT = process.env.PORT || "5000";
const FORT_END_URL = process.env.FORT_END_URL || "http://localhost:5173";

const httpServer = http.createServer(server); // Create HTTP server
const io = new socketServer(httpServer, {
      cors: { origin: FORT_END_URL, credentials: true },
});

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use(cors({ credentials: true, origin: FORT_END_URL }));
server.use(cookieParser());

server.use(morgan("dev"));
server.use((req, res, next) => {
      req.io = io;
      next();
});

server.get("/", (req, res) => {
      res.json("hai wow good");
});

server.use("/notifications", notificationRoutes);
server.use("/teams", teamRoutes);

server.use("/auth", userRouter);
server.use(notFound);
server.use(errorHandler);

mongooseConnect();

httpServer.listen(process.env.PORT, () => {
      console.log(
            "server run ayye !!!! at http://localhost:" + process.env.PORT + "/"
      );
});

io.use((socket, next) => {
      console.log();
      const cookie = socket.handshake.headers?.cookie;

      if (!cookie) return next();
      const token = socket.handshake.headers.cookie
            .split("; ")
            .find((cookie) => cookie.startsWith("jwt="))
            .split("=")[1];

      // Verify JWT token
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                  return next(new Error("Authentication error"));
            }
            // Attach user information to socket object
            socket.user = decoded;
            next();
      });
      next();
});
io.on("connection", (socket) => {
      console.log("socket.user?.userId", socket.user?.userId);
      if (socket.user?.userId) {
            connectedSockets[socket.user.userId] = socket.id; // Store socket ID with user ID
      }

      console.log(`Socket ${socket.id} connected`);

      socket.on("disconnect", () => {
            console.log(`Socket ${socket.id} disconnected`);
            // Remove disconnected socket from the connectedSockets object
            for (const userId in connectedSockets) {
                  if (connectedSockets[userId] === socket.id) {
                        delete connectedSockets[userId];
                        break;
                  }
            }
      });
});
export function sendNotification(notification, userId) {
      console.log("user in socket", connectedSockets);
      const socketId = connectedSockets[userId];

      if (socketId) {
            io.to(socketId).emit("notification", notification);
      } else {
            console.log(`No socket found for user ID ${userId}`);
      }
}
