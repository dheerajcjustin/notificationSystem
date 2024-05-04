import { Router } from "express";

// import { validateTeamId } from "../middleware/parseTeamIdParams.js";
import {
      authUser,
      logoutUser,
      registerUser,
} from "../controllers/userController.js";

const router = Router();

router.post("/login", authUser);
router.post("/register", registerUser);
router.get("/logout", logoutUser);

export default router;
