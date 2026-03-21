import express from "express";
import {
  createChild,
  getChildrenByParent,
  getChildById,
  updateChild,
  deleteChild
} from "../controllers/ChildController.js";
import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/", protect, createChild);
router.get("/parent/:parentId", protect, getChildrenByParent);
router.get("/:id", protect, getChildById);
router.put("/:id", protect, updateChild);
router.delete("/:id", protect, deleteChild);

export default router;
