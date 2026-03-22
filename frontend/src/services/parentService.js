import { api } from './api';

export const parentService = {
  // Dashboard
  getDashboardOverview: async () => {
    return api.get('/parent/dashboard');
  },

  // Children
  getChildren: async () => {
    return api.get('/parent/children');
  },

  getChildById: async (childId) => {
    return api.get(`/parent/children/${childId}`);
  },

  addChild: async (childData) => {
    return api.post('/parent/children', childData);
  },

  updateChild: async (childId, childData) => {
    return api.put(`/parent/children/${childId}`, childData);
  },

  deleteChild: async (childId) => {
    return api.delete(`/parent/children/${childId}`);
  },

  // Vaccinations
  getVaccinations: async (childId = null) => {
    return api.get(`/parent/vaccinations${childId ? `?childId=${childId}` : ''}`);
  },

  addVaccination: async (vaccinationData) => {
    return api.post('/parent/vaccinations', vaccinationData);
  },

  updateVaccination: async (vaccinationId, vaccinationData) => {
    return api.put(`/parent/vaccinations/${vaccinationId}`, vaccinationData);
  },

  deleteVaccination: async (vaccinationId) => {
    return api.delete(`/parent/vaccinations/${vaccinationId}`);
  },

  // Reminders
  getReminders: async () => {
    return api.get('/parent/reminders');
  },

  addReminder: async (reminderData) => {
    return api.post('/parent/reminders', reminderData);
  },

  updateReminder: async (reminderId, reminderData) => {
    return api.put(`/parent/reminders/${reminderId}`, reminderData);
  },

  deleteReminder: async (reminderId) => {
    return api.delete(`/parent/reminders/${reminderId}`);
  },

  markReminderComplete: async (reminderId) => {
    return api.post(`/parent/reminders/${reminderId}/complete`, {});
  },

  // Medical Records
  getMedicalRecords: async (childId = null) => {
    return api.get(`/parent/medical${childId ? `?childId=${childId}` : ''}`);
  },

  addMedicalRecord: async (recordData) => {
    return api.post('/parent/medical', recordData);
  },

  updateMedicalRecord: async (recordId, recordData) => {
    return api.put(`/parent/medical/${recordId}`, recordData);
  },

  deleteMedicalRecord: async (recordId) => {
    return api.delete(`/parent/medical/${recordId}`);
  },

  // Growth Tracking
  getGrowthData: async (childId) => {
    return api.get(`/parent/growth/${childId}`);
  },

  addGrowthEntry: async (childId, growthData) => {
    return api.post(`/parent/growth/${childId}`, growthData);
  },

  deleteGrowthEntry: async (entryId) => {
    return api.delete(`/parent/growth/entry/${entryId}`);
  },

  // Nutrition & Care
  getNutritionLogs: async (childId = null) => {
    return api.get(`/parent/nutrition${childId ? `?childId=${childId}` : ''}`);
  },

  addNutritionLog: async (logData) => {
    return api.post('/parent/nutrition', logData);
  },

  deleteNutritionLog: async (logId) => {
    return api.delete(`/parent/nutrition/${logId}`);
  },

  // Appointments
  getAppointments: async () => {
    return api.get('/parent/appointments');
  },

  addAppointment: async (appointmentData) => {
    return api.post('/parent/appointments', appointmentData);
  },

  updateAppointment: async (appointmentId, appointmentData) => {
    return api.put(`/parent/appointments/${appointmentId}`, appointmentData);
  },

  deleteAppointment: async (appointmentId) => {
    return api.delete(`/parent/appointments/${appointmentId}`);
  },

  // Emergency Contacts
  getEmergencyContacts: async () => {
    return api.get('/parent/emergency/contacts');
  },

  addEmergencyContact: async (contactData) => {
    return api.post('/parent/emergency/contacts', contactData);
  },

  updateEmergencyContact: async (contactId, contactData) => {
    return api.put(`/parent/emergency/contacts/${contactId}`, contactData);
  },

  deleteEmergencyContact: async (contactId) => {
    return api.delete(`/parent/emergency/contacts/${contactId}`);
  },

  // Settings
  getSettings: async () => {
    return api.get('/parent/settings');
  },

  updateSettings: async (settingsData) => {
    return api.put('/parent/settings', settingsData);
  },

  updateProfile: async (profileData) => {
    return api.put('/parent/profile', profileData);
  },

  changePassword: async (passwordData) => {
    return api.post('/parent/change-password', passwordData);
  },
};
