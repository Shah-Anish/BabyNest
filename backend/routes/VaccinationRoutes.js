import express from "express";
import {
  addVaccination,
  getVaccinationsByChild,
  updateVaccinationStatus,
  deleteVaccination
} from "../controllers/VaccinationController.js";
import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/", protect, addVaccination);
router.get("/child/:childId", protect, getVaccinationsByChild);
router.put("/:id", protect, updateVaccinationStatus);
router.delete("/:id", protect, deleteVaccination);

export default router;
