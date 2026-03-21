import express from "express";
import {
  addPrescription,
  getPrescriptionsByVisit,
  updatePrescription,
  deletePrescription
} from "../controllers/PrescriptionController.js";
import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/", protect, addPrescription);
router.get("/visit/:visitId", protect, getPrescriptionsByVisit);
router.put("/:id", protect, updatePrescription);
router.delete("/:id", protect, deletePrescription);

export default router;
