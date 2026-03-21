import DoctorContact from "../model/DoctorContact.js";
import mongoose from "mongoose";

// Add a new doctor contact
export const addDoctor = async (req, res) => {
  try {
    const { parentId, name, specialization, phone, hospital } = req.body;

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

    const doctor = await DoctorContact.create({
      parentId,
      name,
      specialization,
      phone,
      hospital
    });

    res.status(201).json({
      success: true,
      message: "Doctor contact added successfully",
      data: doctor
    });
  } catch (error) {
    console.error("Error adding doctor:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add doctor contact",
      error: error.message
    });
  }
};

// Get all doctor contacts for a parent
export const getDoctors = async (req, res) => {
  try {
    const { parentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(parentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid parent ID format"
      });
    }

    const doctors = await DoctorContact.find({ parentId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch doctor contacts",
      error: error.message
    });
  }
};

// Update a doctor contact
export const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID format"
      });
    }

    if (updateData.parentId) {
      return res.status(400).json({
        success: false,
        message: "Parent ID cannot be updated"
      });
    }

    const doctor = await DoctorContact.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor contact not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Doctor contact updated successfully",
      data: doctor
    });
  } catch (error) {
    console.error("Error updating doctor:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update doctor contact",
      error: error.message
    });
  }
};

// Delete a doctor contact
export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID format"
      });
    }

    const doctor = await DoctorContact.findByIdAndDelete(id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor contact not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Doctor contact deleted successfully",
      data: doctor
    });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete doctor contact",
      error: error.message
    });
  }
};
