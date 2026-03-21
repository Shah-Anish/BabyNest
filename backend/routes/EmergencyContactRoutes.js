import express from "express";
import {
  addEmergencyContact,
  getEmergencyContacts,
  updateEmergencyContact,
  deleteEmergencyContact
} from "../controllers/EmergencyContactController.js";
import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/", protect, addEmergencyContact);
router.get("/parent/:parentId", protect, getEmergencyContacts);
router.put("/:id", protect, updateEmergencyContact);
router.delete("/:id", protect, deleteEmergencyContact);

export default router;
