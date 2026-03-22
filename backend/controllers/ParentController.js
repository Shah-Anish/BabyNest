import Child from '../model/ChildProfile.js';
import Vaccination from '../model/Vaccination.js';
import Reminder from '../model/Reminder.js';
import MedicalVisit from '../model/MedicalVisit.js';
import GrowthRecord from '../model/GrowthRecord.js';
import NutritionLog from '../model/NutritionLog.js';
import Appointment from '../model/Appointment.js';
import EmergencyContact from '../model/EmergencyContact.js';

export const getDashboardOverview = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get total children
    const totalChildren = await Child.countDocuments({ parentId: userId });

    const parentChildren = await Child.find({ parentId: userId }).select('_id');
    const childIds = parentChildren.map((child) => child._id);

    // Get upcoming vaccinations (next 30 days)
    const upcomingVaccinations = await Vaccination.countDocuments({
      childId: { $in: childIds },
      status: { $ne: 'completed' }
    });

    // Get active reminders
    const activeReminders = await Reminder.countDocuments({
      userId: userId,
      remindAt: { $gte: new Date() },
      isSent: false
    });

    // Get upcoming appointments
    const upcomingAppointments = await Appointment.countDocuments({
      parentId: userId,
      date: { $gte: new Date() },
      status: { $ne: 'cancelled' }
    });

    res.status(200).json({
      totalChildren,
      upcomingVaccinations,
      activeReminders,
      upcomingAppointments
    });
  } catch (error) {
    console.error('Error fetching dashboard overview:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard overview', error: error.message });
  }
};

export const getParentChildren = async (req, res) => {
  try {
    const userId = req.user.id;
    const children = await Child.find({ parentId: userId });
    res.status(200).json({ 
      children: children,
      count: children.length
    });
  } catch (error) {
    console.error('Error fetching children:', error);
    res.status(500).json({ message: 'Failed to fetch children', error: error.message });
  }
};

export const getParentChildById = async (req, res) => {
  try {
    const { childId } = req.params;
    const userId = req.user.id;

    const child = await Child.findOne({
      _id: childId,
      parentId: userId
    });

    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }

    res.status(200).json(child);
  } catch (error) {
    console.error('Error fetching child:', error);
    res.status(500).json({ message: 'Failed to fetch child', error: error.message });
  }
};

export const addParentChild = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, dateOfBirth, gender, bloodType } = req.body;

    const child = new Child({
      parentId: userId,
      name,
      birthDate: dateOfBirth,  // Map dateOfBirth to birthDate
      gender,
      // bloodType is not in the model, so we skip it
    });

    await child.save();
    res.status(201).json(child);
  } catch (error) {
    console.error('Error adding child:', error);
    res.status(500).json({ message: 'Failed to add child', error: error.message });
  }
};

export const updateParentChild = async (req, res) => {
  try {
    const { childId } = req.params;
    const userId = req.user.id;

    const child = await Child.findOneAndUpdate(
      { _id: childId, parentId: userId },
      req.body,
      { new: true }
    );

    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }

    res.status(200).json(child);
  } catch (error) {
    console.error('Error updating child:', error);
    res.status(500).json({ message: 'Failed to update child', error: error.message });
  }
};

export const deleteParentChild = async (req, res) => {
  try {
    const { childId } = req.params;
    const userId = req.user.id;

    const child = await Child.findOneAndDelete({
      _id: childId,
      parentId: userId
    });

    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }

    res.status(200).json({ message: 'Child deleted successfully' });
  } catch (error) {
    console.error('Error deleting child:', error);
    res.status(500).json({ message: 'Failed to delete child', error: error.message });
  }
};

// Vaccination endpoints
export const getParentVaccinations = async (req, res) => {
  try {
    const userId = req.user.id;
    const { childId } = req.query;

    const parentChildren = await Child.find({ parentId: userId }).select('_id');
    const childIds = parentChildren.map((child) => child._id);

    const query = { childId: { $in: childIds } };
    if (childId) query.childId = childId;

    const vaccinations = await Vaccination.find(query).populate('childId', 'name');
    res.status(200).json({ vaccinations, count: vaccinations.length });
  } catch (error) {
    console.error('Error fetching vaccinations:', error);
    res.status(500).json({ message: 'Failed to fetch vaccinations', error: error.message });
  }
};

export const addParentVaccination = async (req, res) => {
  try {
    const userId = req.user.id;
    const { childId, name, recommendedAge, status, administeredDate } = req.body;

    const child = await Child.findOne({ _id: childId, parentId: userId });
    if (!child) {
      return res.status(404).json({ message: 'Child not found for this parent' });
    }

    const vaccination = new Vaccination({
      childId,
      name,
      recommendedAge,
      status: status || 'pending',
      administeredDate
    });

    await vaccination.save();
    res.status(201).json(vaccination);
  } catch (error) {
    console.error('Error adding vaccination:', error);
    res.status(500).json({ message: 'Failed to add vaccination', error: error.message });
  }
};

export const updateParentVaccination = async (req, res) => {
  try {
    const { vaccinationId } = req.params;
    const userId = req.user.id;

    const parentChildren = await Child.find({ parentId: userId }).select('_id');
    const childIds = parentChildren.map((child) => child._id);

    const vaccination = await Vaccination.findOneAndUpdate(
      { _id: vaccinationId, childId: { $in: childIds } },
      req.body,
      { new: true }
    );

    if (!vaccination) {
      return res.status(404).json({ message: 'Vaccination not found' });
    }

    res.status(200).json(vaccination);
  } catch (error) {
    console.error('Error updating vaccination:', error);
    res.status(500).json({ message: 'Failed to update vaccination', error: error.message });
  }
};

export const deleteParentVaccination = async (req, res) => {
  try {
    const { vaccinationId } = req.params;
    const userId = req.user.id;

    const parentChildren = await Child.find({ parentId: userId }).select('_id');
    const childIds = parentChildren.map((child) => child._id);

    const vaccination = await Vaccination.findOneAndDelete({
      _id: vaccinationId,
      childId: { $in: childIds }
    });

    if (!vaccination) {
      return res.status(404).json({ message: 'Vaccination not found' });
    }

    res.status(200).json({ message: 'Vaccination deleted successfully' });
  } catch (error) {
    console.error('Error deleting vaccination:', error);
    res.status(500).json({ message: 'Failed to delete vaccination', error: error.message });
  }
};

// Reminder endpoints
export const getParentReminders = async (req, res) => {
  try {
    const userId = req.user.id;

    const reminders = await Reminder.find({ userId }).sort({ remindAt: 1 });
    res.status(200).json({ reminders, count: reminders.length });
  } catch (error) {
    console.error('Error fetching reminders:', error);
    res.status(500).json({ message: 'Failed to fetch reminders', error: error.message });
  }
};

export const addParentReminder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { childId, type, message, remindAt } = req.body;

    // Validate required fields
    if (!childId) {
      return res.status(400).json({ message: 'Child ID is required' });
    }
    if (!type || !['vaccine', 'appointment', 'medication'].includes(type)) {
      return res.status(400).json({ message: 'Valid type required: vaccine, appointment, or medication' });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }
    if (!remindAt) {
      return res.status(400).json({ message: 'Remind date is required' });
    }

    const reminder = new Reminder({
      userId,
      childId,
      type,
      message,
      remindAt,
      isSent: false
    });

    await reminder.save();
    res.status(201).json(reminder);
  } catch (error) {
    console.error('Error adding reminder:', error);
    res.status(500).json({ message: 'Failed to add reminder', error: error.message });
  }
};

export const updateParentReminder = async (req, res) => {
  try {
    const { reminderId } = req.params;
    const userId = req.user.id;

    const reminder = await Reminder.findOneAndUpdate(
      { _id: reminderId, userId },
      req.body,
      { new: true }
    );

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    res.status(200).json(reminder);
  } catch (error) {
    console.error('Error updating reminder:', error);
    res.status(500).json({ message: 'Failed to update reminder', error: error.message });
  }
};

export const deleteParentReminder = async (req, res) => {
  try {
    const { reminderId } = req.params;
    const userId = req.user.id;

    const reminder = await Reminder.findOneAndDelete({
      _id: reminderId,
      userId
    });

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    res.status(200).json({ message: 'Reminder deleted successfully' });
  } catch (error) {
    console.error('Error deleting reminder:', error);
    res.status(500).json({ message: 'Failed to delete reminder', error: error.message });
  }
};

export const markReminderComplete = async (req, res) => {
  try {
    const { reminderId } = req.params;
    const userId = req.user.id;

    const reminder = await Reminder.findOneAndUpdate(
      { _id: reminderId, userId },
      { isSent: true },
      { new: true }
    );

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    res.status(200).json(reminder);
  } catch (error) {
    console.error('Error marking reminder complete:', error);
    res.status(500).json({ message: 'Failed to mark reminder complete', error: error.message });
  }
};

// Medical Records endpoints
export const getParentMedical = async (req, res) => {
  try {
    const userId = req.user.id;
    const { childId } = req.query;

    // Get all children for this parent
    const children = await Child.find({ parentId: userId });
    const childIds = children.map(c => c._id);

    // Build query
    let query = { childId: { $in: childIds } };
    if (childId) {
      query.childId = childId;
    }

    const medicalVisits = await MedicalVisit.find(query)
      .populate('childId', 'name')
      .sort({ visitDate: -1 });

    const records = medicalVisits.map(visit => ({
      id: visit._id,
      _id: visit._id,
      childName: visit.childId?.name || 'Unknown',
      title: `Visit - ${visit.doctorName}`,
      recordType: 'Doctor Visit',
      date: visit.visitDate,
      diagnosis: visit.notes,
      doctorName: visit.doctorName,
      visitDate: visit.visitDate,
      notes: visit.notes
    }));

    res.status(200).json({ records, count: records.length });
  } catch (error) {
    console.error('Error fetching medical records:', error);
    res.status(500).json({ message: 'Failed to fetch medical records', error: error.message });
  }
};

export const addParentMedical = async (req, res) => {
  try {
    const userId = req.user.id;
    const { childId, doctorName, visitDate, notes } = req.body;

    if (!childId) {
      return res.status(400).json({ message: 'Child ID is required' });
    }
    if (!doctorName || !doctorName.trim()) {
      return res.status(400).json({ message: 'Doctor name is required' });
    }
    if (!visitDate) {
      return res.status(400).json({ message: 'Visit date is required' });
    }

    // Verify child belongs to parent
    const child = await Child.findOne({ _id: childId, parentId: userId });
    if (!child) {
      return res.status(403).json({ message: 'Child not found or access denied' });
    }

    const medicalVisit = new MedicalVisit({
      childId,
      doctorName,
      visitDate,
      notes: notes || ''
    });

    await medicalVisit.save();
    res.status(201).json(medicalVisit);
  } catch (error) {
    console.error('Error adding medical record:', error);
    res.status(500).json({ message: 'Failed to add medical record', error: error.message });
  }
};

export const updateParentMedical = async (req, res) => {
  try {
    const userId = req.user.id;
    const { recordId } = req.params;
    const { doctorName, visitDate, notes } = req.body;

    // Verify ownership
    const medicalVisit = await MedicalVisit.findById(recordId).populate('childId');
    if (!medicalVisit) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    const child = await Child.findOne({ _id: medicalVisit.childId, parentId: userId });
    if (!child) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updated = await MedicalVisit.findByIdAndUpdate(
      recordId,
      { doctorName, visitDate, notes },
      { new: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    console.error('Error updating medical record:', error);
    res.status(500).json({ message: 'Failed to update medical record', error: error.message });
  }
};

export const deleteParentMedical = async (req, res) => {
  try {
    const userId = req.user.id;
    const { recordId } = req.params;

    // Verify ownership
    const medicalVisit = await MedicalVisit.findById(recordId).populate('childId');
    if (!medicalVisit) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    const child = await Child.findOne({ _id: medicalVisit.childId, parentId: userId });
    if (!child) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await MedicalVisit.findByIdAndDelete(recordId);
    res.status(200).json({ message: 'Medical record deleted successfully' });
  } catch (error) {
    console.error('Error deleting medical record:', error);
    res.status(500).json({ message: 'Failed to delete medical record', error: error.message });
  }
};

// Growth Tracking endpoints
export const getParentGrowth = async (req, res) => {
  try {
    const userId = req.user.id;
    const { childId } = req.params;

    // Verify child belongs to parent
    const child = await Child.findOne({ _id: childId, parentId: userId });
    if (!child) {
      return res.status(403).json({ message: 'Child not found or access denied' });
    }

    const growthRecords = await GrowthRecord.find({ childId }).sort({ date: -1 });

    const latestRecord = growthRecords[0];
    const data = {
      latestHeight: latestRecord?.height || null,
      latestWeight: latestRecord?.weight || null,
      latestHeadCirc: latestRecord?.headCircumference || null,
      history: growthRecords.map(record => ({
        _id: record._id,
        date: record.date,
        height: record.height,
        weight: record.weight,
        headCircumference: record.headCircumference,
        bmi: record.bmi
      }))
    };

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching growth data:', error);
    res.status(500).json({ message: 'Failed to fetch growth data', error: error.message });
  }
};

export const addGrowthEntry = async (req, res) => {
  try {
    const userId = req.user.id;
    const { childId } = req.params;
    const { date, height, weight, headCircumference } = req.body;

    // Verify child belongs to parent
    const child = await Child.findOne({ _id: childId, parentId: userId });
    if (!child) {
      return res.status(403).json({ message: 'Child not found or access denied' });
    }

    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }
    if (height === undefined || height === null || height === '') {
      return res.status(400).json({ message: 'Height is required' });
    }
    if (weight === undefined || weight === null || weight === '') {
      return res.status(400).json({ message: 'Weight is required' });
    }

    // Calculate BMI if height and weight are provided
    let bmi = null;
    if (height && weight) {
      const heightMeters = height / 100;
      bmi = parseFloat((weight / (heightMeters * heightMeters)).toFixed(2));
    }

    const growthRecord = new GrowthRecord({
      childId,
      date,
      height: parseFloat(height),
      weight: parseFloat(weight),
      headCircumference: headCircumference ? parseFloat(headCircumference) : null,
      bmi
    });

    await growthRecord.save();
    res.status(201).json(growthRecord);
  } catch (error) {
    console.error('Error adding growth entry:', error);
    res.status(500).json({ message: 'Failed to add growth entry', error: error.message });
  }
};

export const deleteGrowthEntry = async (req, res) => {
  try {
    const userId = req.user.id;
    const { entryId } = req.params;

    // Verify ownership
    const growthRecord = await GrowthRecord.findById(entryId).populate('childId');
    if (!growthRecord) {
      return res.status(404).json({ message: 'Growth entry not found' });
    }

    const child = await Child.findOne({ _id: growthRecord.childId, parentId: userId });
    if (!child) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await GrowthRecord.findByIdAndDelete(entryId);
    res.status(200).json({ message: 'Growth entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting growth entry:', error);
    res.status(500).json({ message: 'Failed to delete growth entry', error: error.message });
  }
};

// Nutrition Logs endpoints
export const getNutritionLogs = async (req, res) => {
  try {
    const userId = req.user.id;
    const { childId } = req.query;

    // Get all children for this parent
    const children = await Child.find({ parentId: userId });
    const childIds = children.map(c => c._id);

    // Build query
    let query = { childId: { $in: childIds } };
    if (childId) {
      query.childId = childId;
    }

    const nutritionLogs = await NutritionLog.find(query)
      .populate('childId', 'name')
      .sort({ timestamp: -1 });

    const logs = nutritionLogs.map(log => ({
      _id: log._id,
      id: log._id,
      childId: log.childId._id,
      childName: log.childId.name || 'Unknown',
      type: log.type,
      title: log.title || `${log.type.charAt(0).toUpperCase() + log.type.slice(1)}`,
      details: log.details,
      timestamp: log.timestamp
    }));

    res.status(200).json({ logs, count: logs.length });
  } catch (error) {
    console.error('Error fetching nutrition logs:', error);
    res.status(500).json({ message: 'Failed to fetch nutrition logs', error: error.message });
  }
};

export const addNutritionLog = async (req, res) => {
  try {
    const userId = req.user.id;
    const { childId, type, title, details, timestamp } = req.body;

    if (!childId) {
      return res.status(400).json({ message: 'Child ID is required' });
    }
    if (!type) {
      return res.status(400).json({ message: 'Log type is required' });
    }
    if (!timestamp) {
      return res.status(400).json({ message: 'Timestamp is required' });
    }

    // Verify child belongs to parent
    const child = await Child.findOne({ _id: childId, parentId: userId });
    if (!child) {
      return res.status(403).json({ message: 'Child not found or access denied' });
    }

    const nutritionLog = new NutritionLog({
      childId,
      type,
      title: title || `${type.charAt(0).toUpperCase() + type.slice(1)}`,
      details: details || '',
      timestamp: new Date(timestamp)
    });

    await nutritionLog.save();
    
    const populatedLog = await NutritionLog.findById(nutritionLog._id).populate('childId', 'name');
    
    res.status(201).json({
      _id: populatedLog._id,
      id: populatedLog._id,
      childId: populatedLog.childId._id,
      childName: populatedLog.childId.name,
      type: populatedLog.type,
      title: populatedLog.title,
      details: populatedLog.details,
      timestamp: populatedLog.timestamp
    });
  } catch (error) {
    console.error('Error adding nutrition log:', error);
    res.status(500).json({ message: 'Failed to add nutrition log', error: error.message });
  }
};

export const deleteNutritionLog = async (req, res) => {
  try {
    const userId = req.user.id;
    const { logId } = req.params;

    // Verify ownership
    const nutritionLog = await NutritionLog.findById(logId).populate('childId');
    if (!nutritionLog) {
      return res.status(404).json({ message: 'Nutrition log not found' });
    }

    const child = await Child.findOne({ _id: nutritionLog.childId, parentId: userId });
    if (!child) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await NutritionLog.findByIdAndDelete(logId);
    res.status(200).json({ message: 'Nutrition log deleted successfully' });
  } catch (error) {
    console.error('Error deleting nutrition log:', error);
    res.status(500).json({ message: 'Failed to delete nutrition log', error: error.message });
  }
};

  // Appointments endpoints
  export const getAppointments = async (req, res) => {
    try {
      const userId = req.user.id;
      const { childId } = req.query;

      // Get all children for this parent
      const children = await Child.find({ parentId: userId });
      const childIds = children.map(c => c._id);

      // Build query
      let query = { childId: { $in: childIds } };
      if (childId) {
        query.childId = childId;
      }

      const appointments = await Appointment.find(query)
        .populate('childId', 'name')
        .sort({ date: 1 });

      const formattedAppointments = appointments.map(app => ({
        _id: app._id,
        id: app._id,
        childId: app.childId._id,
        childName: app.childId.name || 'Unknown',
        title: app.title,
        date: app.date,
        time: app.time,
        location: app.location,
        doctorName: app.doctorName,
        notes: app.notes,
        status: app.status,
        reminders: app.reminders
      }));

      res.status(200).json({ appointments: formattedAppointments, count: formattedAppointments.length });
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
    }
  };

  export const addAppointment = async (req, res) => {
    try {
      const userId = req.user.id;
      const { childId, title, date, time, location, doctorName, notes } = req.body;

      if (!childId) {
        return res.status(400).json({ message: 'Child ID is required' });
      }
      if (!title) {
        return res.status(400).json({ message: 'Appointment title is required' });
      }
      if (!date) {
        return res.status(400).json({ message: 'Appointment date is required' });
      }

      // Verify child belongs to parent
      const child = await Child.findOne({ _id: childId, parentId: userId });
      if (!child) {
        return res.status(403).json({ message: 'Child not found or access denied' });
      }

      const appointment = new Appointment({
        childId,
        parentId: userId,
        title,
        date: new Date(date),
        time: time || null,
        location: location || null,
        doctorName: doctorName || null,
        notes: notes || null,
        status: 'scheduled'
      });

      await appointment.save();
    
      const populatedApp = await Appointment.findById(appointment._id).populate('childId', 'name');
    
      res.status(201).json({
        _id: populatedApp._id,
        id: populatedApp._id,
        childId: populatedApp.childId._id,
        childName: populatedApp.childId.name,
        title: populatedApp.title,
        date: populatedApp.date,
        time: populatedApp.time,
        location: populatedApp.location,
        doctorName: populatedApp.doctorName,
        notes: populatedApp.notes,
        status: populatedApp.status,
        reminders: populatedApp.reminders
      });
    } catch (error) {
      console.error('Error adding appointment:', error);
      res.status(500).json({ message: 'Failed to add appointment', error: error.message });
    }
  };

  export const updateAppointment = async (req, res) => {
    try {
      const userId = req.user.id;
      const { appointmentId } = req.params;
      const { title, date, time, location, doctorName, notes, status } = req.body;

      // Verify ownership
      const appointment = await Appointment.findById(appointmentId).populate('childId');
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }

      const child = await Child.findOne({ _id: appointment.childId, parentId: userId });
      if (!child) {
        return res.status(403).json({ message: 'Access denied' });
      }

      // Update fields
      if (title) appointment.title = title;
      if (date) appointment.date = new Date(date);
      if (time !== undefined) appointment.time = time;
      if (location !== undefined) appointment.location = location;
      if (doctorName !== undefined) appointment.doctorName = doctorName;
      if (notes !== undefined) appointment.notes = notes;
      if (status) appointment.status = status;

      await appointment.save();

      const updatedApp = await Appointment.findById(appointmentId).populate('childId', 'name');

      res.status(200).json({
        _id: updatedApp._id,
        id: updatedApp._id,
        childId: updatedApp.childId._id,
        childName: updatedApp.childId.name,
        title: updatedApp.title,
        date: updatedApp.date,
        time: updatedApp.time,
        location: updatedApp.location,
        doctorName: updatedApp.doctorName,
        notes: updatedApp.notes,
        status: updatedApp.status,
        reminders: updatedApp.reminders
      });
    } catch (error) {
      console.error('Error updating appointment:', error);
      res.status(500).json({ message: 'Failed to update appointment', error: error.message });
    }
  };

  export const deleteAppointment = async (req, res) => {
    try {
      const userId = req.user.id;
      const { appointmentId } = req.params;

      // Verify ownership
      const appointment = await Appointment.findById(appointmentId).populate('childId');
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }

      const child = await Child.findOne({ _id: appointment.childId, parentId: userId });
      if (!child) {
        return res.status(403).json({ message: 'Access denied' });
      }

      await Appointment.findByIdAndDelete(appointmentId);
      res.status(200).json({ message: 'Appointment deleted successfully' });
    } catch (error) {
      console.error('Error deleting appointment:', error);
      res.status(500).json({ message: 'Failed to delete appointment', error: error.message });
    }
  };

// Emergency Contacts endpoints
export const getEmergencyContacts = async (req, res) => {
  try {
    const userId = req.user.id;

    const contacts = await EmergencyContact.find({ parentId: userId }).sort({ createdAt: -1 });

    const formattedContacts = contacts.map(contact => ({
      _id: contact._id,
      id: contact._id,
      name: contact.name,
      relation: contact.relation,
      relationship: contact.relation,
      phone: contact.phone,
      email: contact.email || '',
      address: contact.address || ''
    }));

    res.status(200).json({ contacts: formattedContacts, count: formattedContacts.length });
  } catch (error) {
    console.error('Error fetching emergency contacts:', error);
    res.status(500).json({ message: 'Failed to fetch emergency contacts', error: error.message });
  }
};

export const addEmergencyContact = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, relation, relationship, phone, email, address } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: 'Name and phone are required' });
    }

    const contact = new EmergencyContact({
      parentId: userId,
      name,
      relation: relation || relationship || '',
      phone,
      email: email || '',
      address: address || ''
    });

    await contact.save();

    res.status(201).json({
      _id: contact._id,
      id: contact._id,
      name: contact.name,
      relation: contact.relation,
      relationship: contact.relation,
      phone: contact.phone,
      email: contact.email || '',
      address: contact.address || ''
    });
  } catch (error) {
    console.error('Error adding emergency contact:', error);
    res.status(500).json({ message: 'Failed to add emergency contact', error: error.message });
  }
};

export const updateEmergencyContact = async (req, res) => {
  try {
    const userId = req.user.id;
    const { contactId } = req.params;
    const { name, relation, relationship, phone, email, address } = req.body;

    const contact = await EmergencyContact.findOne({ _id: contactId, parentId: userId });
    if (!contact) {
      return res.status(404).json({ message: 'Emergency contact not found' });
    }

    if (name !== undefined) contact.name = name;
    if (relation !== undefined || relationship !== undefined) {
      contact.relation = relation ?? relationship ?? '';
    }
    if (phone !== undefined) contact.phone = phone;
    if (email !== undefined) contact.email = email;
    if (address !== undefined) contact.address = address;

    await contact.save();

    res.status(200).json({
      _id: contact._id,
      id: contact._id,
      name: contact.name,
      relation: contact.relation,
      relationship: contact.relation,
      phone: contact.phone,
      email: contact.email || '',
      address: contact.address || ''
    });
  } catch (error) {
    console.error('Error updating emergency contact:', error);
    res.status(500).json({ message: 'Failed to update emergency contact', error: error.message });
  }
};

export const deleteEmergencyContact = async (req, res) => {
  try {
    const userId = req.user.id;
    const { contactId } = req.params;

    const contact = await EmergencyContact.findOne({ _id: contactId, parentId: userId });
    if (!contact) {
      return res.status(404).json({ message: 'Emergency contact not found' });
    }

    await EmergencyContact.findByIdAndDelete(contactId);
    res.status(200).json({ message: 'Emergency contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting emergency contact:', error);
    res.status(500).json({ message: 'Failed to delete emergency contact', error: error.message });
  }
};
