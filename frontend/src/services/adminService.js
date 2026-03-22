import { api } from './api';

export const adminService = {
  // Dashboard Stats
  getDashboardStats: async () => {
    return api.get('/admin/dashboard/stats');
  },

  // User Management
  getUsers: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/admin/users${query ? `?${query}` : ''}`);
  },

  getUserById: async (userId) => {
    return api.get(`/admin/users/${userId}`);
  },

  updateUser: async (userId, data) => {
    return api.put(`/admin/users/${userId}`, data);
  },

  deleteUser: async (userId) => {
    return api.delete(`/admin/users/${userId}`);
  },

  blockUser: async (userId) => {
    return api.post(`/admin/users/${userId}/block`, {});
  },

  unblockUser: async (userId) => {
    return api.post(`/admin/users/${userId}/unblock`, {});
  },

  // Content Management
  getContent: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/admin/content${query ? `?${query}` : ''}`);
  },

  getContentById: async (contentId) => {
    return api.get(`/admin/content/${contentId}`);
  },

  updateContent: async (contentId, data) => {
    return api.put(`/admin/content/${contentId}`, data);
  },

  deleteContent: async (contentId) => {
    return api.delete(`/admin/content/${contentId}`);
  },

  approveContent: async (contentId) => {
    return api.post(`/admin/content/${contentId}/approve`, {});
  },

  rejectContent: async (contentId, reason) => {
    return api.post(`/admin/content/${contentId}/reject`, { reason });
  },

  // Audit Logs
  getAuditLogs: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/admin/logs${query ? `?${query}` : ''}`);
  },

  exportAuditLogs: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/admin/logs/export${query ? `?${query}` : ''}`);
  },

  // System Health
  getSystemHealth: async () => {
    return api.get('/admin/system/health');
  },

  getSystemMetrics: async (timeRange = '24h') => {
    return api.get(`/admin/system/metrics?range=${timeRange}`);
  },

  getServerInfo: async () => {
    return api.get('/admin/system/info');
  },

  clearCache: async () => {
    return api.post('/admin/system/cache/clear', {});
  },

  restartService: async (serviceName) => {
    return api.post(`/admin/system/services/${serviceName}/restart`, {});
  },
};
