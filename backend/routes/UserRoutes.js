import express from "express";
import { getUsers, getUserById, updateUser,deleteUser } from "../controllers/UserController.js";
import { protect, authorize } from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/",protect,authorize("admin"), getUsers);
router.get("/:id", protect, getUserById);
router.put("/:id", protect, updateUser);

router.delete("/:id", protect, authorize("admin"), deleteUser);


export default router;