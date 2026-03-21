import express from "express";
import {
  addDoctor,
  getDoctors,
  updateDoctor,
  deleteDoctor
} from "../controllers/DoctorContactController.js";
import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/", protect, addDoctor);
router.get("/parent/:parentId", protect, getDoctors);
router.put("/:id", protect, updateDoctor);
router.delete("/:id", protect, deleteDoctor);

export default router;
