import express from "express";
import { getAuditLogs } from "../controllers/AuditLogController.js";
import { protect, authorize } from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/", protect, authorize("admin"), getAuditLogs);

export default router;
