import { Router } from "express";
import AppealController from "../controllers/appeal.controller";

const router = Router();
router.get("/", AppealController.getStartedAppeals);
router.post("/", AppealController.createAppeal);
router.patch("/:id/start", AppealController.startProcessing);
router.patch("/:id/complete", AppealController.completeAppeal);
router.patch("/:id/cancel", AppealController.cancelAppeal);
router.post("/cancel-all-in-progress", AppealController.cancelAllInProgress);
router.get("/by-dates", AppealController.getAppealsByDates);
export default router;
