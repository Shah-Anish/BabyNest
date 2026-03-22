import express from 'express';
import {
  getDashboardStats,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  blockUser,
  unblockUser,
  getContent,
  getContentById,
  updateContent,
  deleteContent,
  approveContent,
  rejectContent,
  getAuditLogs,
  exportAuditLogs,
  getSystemHealth,
  getSystemMetrics,
  getServerInfo,
  clearCache,
  restartService
} from '../controllers/AdminController.js';
import { protect } from '../middleware/authmiddleware.js';

const router = express.Router();

// All admin routes require authentication
router.use(protect);

// Dashboard Stats
router.get('/dashboard/stats', getDashboardStats);

// User Management
router.get('/users', getUsers);
router.get('/users/:userId', getUserById);
router.put('/users/:userId', updateUser);
router.delete('/users/:userId', deleteUser);
router.post('/users/:userId/block', blockUser);
router.post('/users/:userId/unblock', unblockUser);

// Content Management
router.get('/content', getContent);
router.get('/content/:contentId', getContentById);
router.put('/content/:contentId', updateContent);
router.delete('/content/:contentId', deleteContent);
router.post('/content/:contentId/approve', approveContent);
router.post('/content/:contentId/reject', rejectContent);

// Audit Logs
router.get('/logs/export', exportAuditLogs);
router.get('/logs', getAuditLogs);

// System Health & Metrics
router.get('/system/health', getSystemHealth);
router.get('/system/metrics', getSystemMetrics);
router.get('/system/info', getServerInfo);
router.post('/system/cache/clear', clearCache);
router.post('/system/services/:serviceName/restart', restartService);

export default router;
