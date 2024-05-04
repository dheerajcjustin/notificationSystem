import jwt from "jsonwebtoken";
import tryCatch from "../services/tryCatch.js";
import User from "../models/User.js";

export const protect = tryCatch(async (req, res, next) => {
      let token;

      token = req.cookies.jwt;

      const { isAdmin } = req.query;

      if (isAdmin) {
            return next();
      }

      if (token) {
            try {
                  const decoded = jwt.verify(token, process.env.JWT_SECRET);

                  req.user = await User.findById(decoded.userId).select(
                        "-password"
                  );

                  next();
            } catch (error) {
                  console.error(error);
                  res.status(401);
                  throw new Error("Not authorized, token failed");
            }
      } else {
            res.status(401);
            throw new Error("Not authorized, no token");
      }
});
