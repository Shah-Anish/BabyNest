import EmergencyContact from "../model/EmergencyContact.js";
import mongoose from "mongoose";

// Add a new emergency contact
export const addEmergencyContact = async (req, res) => {
  try {
    const { parentId, name, relation, phone } = req.body;

    if (!parentId || !name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please provide parentId, name, and phone"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(parentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid parent ID format"
      });
    }

    const emergencyContact = await EmergencyContact.create({
      parentId,
      name,
      relation,
      phone
    });

    res.status(201).json({
      success: true,
      message: "Emergency contact added successfully",
      data: emergencyContact
    });
  } catch (error) {
    console.error("Error adding emergency contact:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add emergency contact",
      error: error.message
    });
  }
};

// Get all emergency contacts for a parent
export const getEmergencyContacts = async (req, res) => {
  try {
    const { parentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(parentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid parent ID format"
      });
    }

    const contacts = await EmergencyContact.find({ parentId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    console.error("Error fetching emergency contacts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch emergency contacts",
      error: error.message
    });
  }
};

// Update an emergency contact
export const updateEmergencyContact = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact ID format"
      });
    }

    if (updateData.parentId) {
      return res.status(400).json({
        success: false,
        message: "Parent ID cannot be updated"
      });
    }

    const contact = await EmergencyContact.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Emergency contact not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Emergency contact updated successfully",
      data: contact
    });
  } catch (error) {
    console.error("Error updating emergency contact:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update emergency contact",
      error: error.message
    });
  }
};

// Delete an emergency contact
export const deleteEmergencyContact = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact ID format"
      });
    }

    const contact = await EmergencyContact.findByIdAndDelete(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Emergency contact not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Emergency contact deleted successfully",
      data: contact
    });
  } catch (error) {
    console.error("Error deleting emergency contact:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete emergency contact",
      error: error.message
    });
  }
};
