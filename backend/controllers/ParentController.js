import Child from '../model/ChildProfile.js';
import Vaccination from '../model/Vaccination.js';
import Reminder from '../model/Reminder.js';
import MedicalVisit from '../model/MedicalVisit.js';

export const getDashboardOverview = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get total children
    const totalChildren = await Child.countDocuments({ parentId: userId });

    // Get upcoming vaccinations (next 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const upcomingVaccinations = await Vaccination.countDocuments({
      parentId: userId,
      vaccinationDate: {
        $gte: new Date(),
        $lte: thirtyDaysFromNow
      },
      status: { $ne: 'completed' }
    });

    // Get active reminders
    const activeReminders = await Reminder.countDocuments({
      userId: userId,
      dueDate: { $gte: new Date() }
    });

    // Get upcoming appointments (medical visits)
    const upcomingAppointments = await MedicalVisit.countDocuments({
      parentId: userId,
      visitDate: { $gte: new Date() }
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
