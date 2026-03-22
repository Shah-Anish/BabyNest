import express from 'express';
import {
  getDashboardOverview,
  getParentChildren,
  getParentChildById,
  addParentChild,
  updateParentChild,
  deleteParentChild
} from '../controllers/ParentController.js';
import { protect } from '../middleware/authmiddleware.js';

const router = express.Router();

// All parent routes require authentication
router.use(protect);

// Dashboard Overview
router.get('/dashboard', getDashboardOverview);

// Children Management
router.get('/children', getParentChildren);
router.get('/children/:childId', getParentChildById);
router.post('/children', addParentChild);
router.put('/children/:childId', updateParentChild);
router.delete('/children/:childId', deleteParentChild);

export default router;
