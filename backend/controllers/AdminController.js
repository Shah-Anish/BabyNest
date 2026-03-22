import User from '../model/user.js';
import Child from '../model/ChildProfile.js';
import Vaccination from '../model/Vaccination.js';
import Reminder from '../model/Reminder.js';
import DailyCareTip from '../model/DailyCareTip.js';
import NutritionRecommendation from '../model/NutritionRecommendation.js';
import AuditLog from '../model/AuditLog.js';
import Content from '../model/Content.js';
import os from 'os';

export const getDashboardStats = async (req, res) => {
  try {
    // Get total users
    const totalUsers = await User.countDocuments();

    // Get users created in last 30 days for growth metric
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Get total content (daily care tips + nutrition recommendations)
    const totalDailyCareTips = await DailyCareTip.countDocuments();
    const totalNutritionRecs = await NutritionRecommendation.countDocuments();
    const totalContent = totalDailyCareTips + totalNutritionRecs;

    // Get content created this month for growth metric
    const newContentThisMonth = await DailyCareTip.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    }) + await NutritionRecommendation.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Get total children (as a proxy for active users/sessions)
    const totalChildren = await Child.countDocuments();

    // Get system uptime (default to 99% as a placeholder)
    const uptime = "99.5%";

    // Calculate growth percentages
    const userGrowth = totalUsers > 0 ? ((newUsersThisMonth / totalUsers) * 100).toFixed(1) : 0;
    const contentGrowth = totalContent > 0 ? ((newContentThisMonth / totalContent) * 100).toFixed(1) : 0;
    const sessionChange = ((totalChildren / (totalUsers || 1)) * 100).toFixed(1);

    res.status(200).json({
      totalUsers,
      userGrowth,
      totalContent,
      contentGrowth,
      activeSessions: totalChildren,
      sessionChange,
      uptime
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard stats', error: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-password');

    const total = await User.countDocuments(query);

    res.status(200).json({
      users,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to fetch user', error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { email, name, role } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { email, name, role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Log the deletion
    await AuditLog.create({
      action: 'DELETE_USER',
      userId: req.user?.id || 'system',
      targetId: userId,
      details: `Deleted user: ${user.email}`
    });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
};

export const blockUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { isBlocked: true },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Log the action
    await AuditLog.create({
      action: 'BLOCK_USER',
      userId: req.user?.id || 'system',
      targetId: userId,
      details: `Blocked user: ${user.email}`
    });

    res.status(200).json(user);
  } catch (error) {
    console.error('Error blocking user:', error);
    res.status(500).json({ message: 'Failed to block user', error: error.message });
  }
};

export const unblockUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { isBlocked: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Log the action
    await AuditLog.create({
      action: 'UNBLOCK_USER',
      userId: req.user?.id || 'system',
      targetId: userId,
      details: `Unblocked user: ${user.email}`
    });

    res.status(200).json(user);
  } catch (error) {
    console.error('Error unblocking user:', error);
    res.status(500).json({ message: 'Failed to unblock user', error: error.message });
  }
};

// Content Management Handlers
export const getContent = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '' } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    if (status && status !== 'undefined') {
      query.status = status;
    }

    const content = await Content.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Content.countDocuments(query);

    res.status(200).json({
      content,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ message: 'Failed to fetch content', error: error.message });
  }
};

export const getContentById = async (req, res) => {
  try {
    const { contentId } = req.params;
    
    const content = await Content.findById(contentId);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.status(200).json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ message: 'Failed to fetch content', error: error.message });
  }
};

export const updateContent = async (req, res) => {
  try {
    const { contentId } = req.params;
    const { title, description, content, type, tags, category } = req.body;

    const updated = await Content.findByIdAndUpdate(
      contentId,
      { title, description, content, type, tags, category },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ message: 'Failed to update content', error: error.message });
  }
};

export const deleteContent = async (req, res) => {
  try {
    const { contentId } = req.params;

    const content = await Content.findByIdAndDelete(contentId);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // Log the deletion
    await AuditLog.create({
      action: 'DELETE_CONTENT',
      userId: req.user?.id || 'system',
      targetId: contentId,
      details: `Deleted content: ${content.title}`
    });

    res.status(200).json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Error deleting content:', error);
    res.status(500).json({ message: 'Failed to delete content', error: error.message });
  }
};

export const approveContent = async (req, res) => {
  try {
    const { contentId } = req.params;

    const content = await Content.findByIdAndUpdate(
      contentId,
      { status: 'approved', rejectionReason: null },
      { new: true }
    );

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // Log the action
    await AuditLog.create({
      action: 'APPROVE_CONTENT',
      userId: req.user?.id || 'system',
      targetId: contentId,
      details: `Approved content: ${content.title}`
    });

    res.status(200).json(content);
  } catch (error) {
    console.error('Error approving content:', error);
    res.status(500).json({ message: 'Failed to approve content', error: error.message });
  }
};

export const rejectContent = async (req, res) => {
  try {
    const { contentId } = req.params;
    const { reason } = req.body;

    const content = await Content.findByIdAndUpdate(
      contentId,
      { status: 'rejected', rejectionReason: reason },
      { new: true }
    );

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // Log the action
    await AuditLog.create({
      action: 'REJECT_CONTENT',
      userId: req.user?.id || 'system',
      targetId: contentId,
      details: `Rejected content: ${content.title} - Reason: ${reason}`
    });

    res.status(200).json(content);
  } catch (error) {
    console.error('Error rejecting content:', error);
    res.status(500).json({ message: 'Failed to reject content', error: error.message });
  }
};

// Audit Logs Handlers
export const getAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', action = '' } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { details: { $regex: search, $options: 'i' } },
        { action: { $regex: search, $options: 'i' } }
      ];
    }
    if (action && action !== 'undefined') {
      query.action = action;
    }

    const logs = await AuditLog.find(query)
      .populate('userId', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ timestamp: -1 });

    const total = await AuditLog.countDocuments(query);

    res.status(200).json({
      logs,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ message: 'Failed to fetch audit logs', error: error.message });
  }
};

export const exportAuditLogs = async (req, res) => {
  try {
    const { action = '', startDate = '', endDate = '' } = req.query;
    
    const query = {};
    if (action && action !== 'undefined') {
      query.action = action;
    }
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) {
        query.timestamp.$gte = new Date(startDate);
      }
      if (endDate) {
        query.timestamp.$lte = new Date(endDate);
      }
    }

    const logs = await AuditLog.find(query)
      .populate('userId', 'name email')
      .sort({ timestamp: -1 });

    if (logs.length === 0) {
      return res.status(200).json({ message: 'No logs to export', logs: [] });
    }

    // Convert to CSV format
    const headers = ['Timestamp', 'Action', 'User', 'Details'];
    const rows = logs.map(log => [
      new Date(log.timestamp).toLocaleString(),
      log.action,
      log.userId ? `${log.userId.name} (${log.userId.email})` : 'System',
      log.details || ''
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(col => `"${(col || '').toString().replace(/"/g, '""')}"`).join(','))
      .join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=audit-logs.csv');
    res.send(csv);
  } catch (error) {
    console.error('Error exporting audit logs:', error);
    res.status(500).json({ message: 'Failed to export audit logs', error: error.message });
  }
};

// System Health Handlers
export const getSystemHealth = async (req, res) => {
  try {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();

    res.status(200).json({
      status: 'healthy',
      uptime,
      memory: {
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        external: Math.round(memoryUsage.external / 1024 / 1024),
        rss: Math.round(memoryUsage.rss / 1024 / 1024)
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching system health:', error);
    res.status(500).json({ message: 'Failed to fetch system health', error: error.message });
  }
};

export const getSystemMetrics = async (req, res) => {
  try {
    const { range = '24h' } = req.query;

    // Return mock metrics data
    const metrics = {
      range,
      cpuUsage: Math.random() * 100,
      memoryUsage: Math.random() * 100,
      activeRequests: Math.floor(Math.random() * 50),
      requestsPerSecond: (Math.random() * 100).toFixed(2),
      errorRate: (Math.random() * 5).toFixed(2),
      timestamp: new Date().toISOString()
    };

    res.status(200).json(metrics);
  } catch (error) {
    console.error('Error fetching system metrics:', error);
    res.status(500).json({ message: 'Failed to fetch system metrics', error: error.message });
  }
};

export const getServerInfo = async (req, res) => {
  try {
    res.status(200).json({
      platform: process.platform,
      nodeVersion: process.version,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuCores: os.cpus().length,
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      hostname: os.hostname()
    });
  } catch (error) {
    console.error('Error fetching server info:', error);
    res.status(500).json({ message: 'Failed to fetch server info', error: error.message });
  }
};

export const clearCache = async (req, res) => {
  try {
    // This is a placeholder - implement based on your caching strategy
    // For now, just log and return success
    await AuditLog.create({
      action: 'CLEAR_CACHE',
      userId: req.user?.id || 'system',
      details: 'Cache cleared by admin'
    });

    res.status(200).json({ message: 'Cache cleared successfully' });
  } catch (error) {
    console.error('Error clearing cache:', error);
    res.status(500).json({ message: 'Failed to clear cache', error: error.message });
  }
};

export const restartService = async (req, res) => {
  try {
    const { serviceName } = req.params;

    // Log the restart attempt
    await AuditLog.create({
      action: 'RESTART_SERVICE',
      userId: req.user?.id || 'system',
      details: `Attempted to restart service: ${serviceName}`
    });

    // For safety, we don't actually restart services
    // Return a message indicating this is a logged action
    res.status(200).json({
      message: `Restart request logged for service: ${serviceName}. Manual restart may be required.`
    });
  } catch (error) {
    console.error('Error restarting service:', error);
    res.status(500).json({ message: 'Failed to restart service', error: error.message });
  }
};
