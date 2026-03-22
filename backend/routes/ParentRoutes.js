import express from 'express';
import {
  getDashboardOverview,
  getParentChildren,
  getParentChildById,
  addParentChild,
  updateParentChild,
  deleteParentChild,
  getParentVaccinations,
  addParentVaccination,
  updateParentVaccination,
  deleteParentVaccination,
  getParentReminders,
  addParentReminder,
  updateParentReminder,
  deleteParentReminder,
  markReminderComplete,
  getParentMedical,
  addParentMedical,
  updateParentMedical,
  deleteParentMedical,
  getParentGrowth,
  addGrowthEntry,
  deleteGrowthEntry,
  getNutritionLogs,
  addNutritionLog,
  deleteNutritionLog,
  getAppointments,
  addAppointment,
  updateAppointment,
  deleteAppointment,
  getEmergencyContacts,
  addEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact
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

// Vaccination Management
router.get('/vaccinations', getParentVaccinations);
router.post('/vaccinations', addParentVaccination);
router.put('/vaccinations/:vaccinationId', updateParentVaccination);
router.delete('/vaccinations/:vaccinationId', deleteParentVaccination);

// Reminder Management
router.get('/reminders', getParentReminders);
router.post('/reminders', addParentReminder);
router.put('/reminders/:reminderId', updateParentReminder);
router.delete('/reminders/:reminderId', deleteParentReminder);
router.post('/reminders/:reminderId/complete', markReminderComplete);

// Medical Records Management
router.get('/medical', getParentMedical);
router.post('/medical', addParentMedical);
router.put('/medical/:recordId', updateParentMedical);
router.delete('/medical/:recordId', deleteParentMedical);

// Growth Tracking Management
router.get('/growth/:childId', getParentGrowth);
router.post('/growth/:childId', addGrowthEntry);
router.delete('/growth/entry/:entryId', deleteGrowthEntry);

// Nutrition Logs Management
router.get('/nutrition', getNutritionLogs);
router.post('/nutrition', addNutritionLog);
router.delete('/nutrition/:logId', deleteNutritionLog);

// Appointments Management
router.get('/appointments', getAppointments);
router.post('/appointments', addAppointment);
router.put('/appointments/:appointmentId', updateAppointment);
router.delete('/appointments/:appointmentId', deleteAppointment);

// Emergency Contacts Management
router.get('/emergency/contacts', getEmergencyContacts);
router.post('/emergency/contacts', addEmergencyContact);
router.put('/emergency/contacts/:contactId', updateEmergencyContact);
router.delete('/emergency/contacts/:contactId', deleteEmergencyContact);

export default router;
