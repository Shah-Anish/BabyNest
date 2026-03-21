import express from "express";
import {
  uploadDocument,
  getDocumentsByVisit,
  deleteDocument
} from "../controllers/MedicalDocumentController.js";
import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/", protect, uploadDocument);
router.get("/visit/:visitId", protect, getDocumentsByVisit);
router.delete("/:id", protect, deleteDocument);

export default router;
