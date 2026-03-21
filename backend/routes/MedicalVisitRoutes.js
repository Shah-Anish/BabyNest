import express from "express";
import {
  createMedicalVisit,
  getVisitsByChild,
  getVisitById,
  updateMedicalVisit,
  deleteMedicalVisit
} from "../controllers/MedicalVisitController.js";
import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/", protect, createMedicalVisit);
router.get("/child/:childId", protect, getVisitsByChild);
router.get("/:id", protect, getVisitById);
router.put("/:id", protect, updateMedicalVisit);
router.delete("/:id", protect, deleteMedicalVisit);

export default router;
