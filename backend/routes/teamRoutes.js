import { Router } from "express";
import {
      addTeamsMember,
      createTeam,
      deleteTeam,
      getTeam,
      getTeams,
      removeTeamMember,
      subscribeToTeam,
      unSubscribeToTeam,
} from "../controllers/teamController.js";
import { validateTeamId } from "../middleware/parseTeamIdParams.js";
import { protect } from "../middleware/authMiddleWare.js";

const router = Router();
router.use("/", protect);

router.route("/").get(getTeams).post(createTeam);

router.use("/:teamId", validateTeamId, protect);

router.route("/:teamId")
      .get(getTeam)
      .post(addTeamsMember)
      .patch(removeTeamMember)
      .delete(deleteTeam);

router.put("/:teamId/subscription", subscribeToTeam);
router.put("/:teamId/unSubscription", unSubscribeToTeam);

export default router;
