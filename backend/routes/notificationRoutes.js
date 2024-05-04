import { Router } from "express";
import { protect } from "../middleware/authMiddleWare.js";
import {
      getNotification,
      notificationRead,
      readAllNotification,
} from "../controllers/notificationControll.js";

const router = Router();

router.use("/", protect);
router.route("/").get(getNotification).put(readAllNotification);

router.route("/:notificationId").put(notificationRead);

export default router;
