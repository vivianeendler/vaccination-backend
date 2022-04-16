import express from "express";
import ScheduleController from "../controllers/ScheduleController.js";

const router = express.Router();
const scheduleController = new ScheduleController();

router.post("/schedule", scheduleController.create);
router.get("/schedules", scheduleController.findAll);
router.put("/schedule/:id", scheduleController.update);

export default router;
