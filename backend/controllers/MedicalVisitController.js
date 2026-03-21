import MedicalVisit from "../model/MedicalVisit.js";
import mongoose from "mongoose";

// Create a new medical visit
export const createMedicalVisit = async (req, res) => {
  try {
    const { childId, doctorName, visitDate, notes } = req.body;

    if (!childId || !doctorName || !visitDate) {
      return res.status(400).json({
        success: false,
        message: "Please provide childId, doctorName, and visitDate"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(childId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid child ID format"
      });
    }

    const medicalVisit = await MedicalVisit.create({
      childId,
      doctorName,
      visitDate,
      notes
    });

    res.status(201).json({
      success: true,
      message: "Medical visit created successfully",
      data: medicalVisit
    });
  } catch (error) {
    console.error("Error creating medical visit:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create medical visit",
      error: error.message
    });
  }
};

// Get all visits by child ID
export const getVisitsByChild = async (req, res) => {
  try {
    const { childId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(childId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid child ID format"
      });
    }

    const visits = await MedicalVisit.find({ childId })
      .sort({ visitDate: -1 });

    res.status(200).json({
      success: true,
      count: visits.length,
      data: visits
    });
  } catch (error) {
    console.error("Error fetching visits:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch visits",
      error: error.message
    });
  }
};

// Get a single visit by ID
export const getVisitById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid visit ID format"
      });
    }

    const visit = await MedicalVisit.findById(id)
      .populate("childId", "name birthDate");

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: "Medical visit not found"
      });
    }

    res.status(200).json({
      success: true,
      data: visit
    });
  } catch (error) {
    console.error("Error fetching visit:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch visit",
      error: error.message
    });
  }
};

// Update a medical visit
export const updateMedicalVisit = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid visit ID format"
      });
    }

    if (updateData.childId) {
      return res.status(400).json({
        success: false,
        message: "Child ID cannot be updated"
      });
    }

    const visit = await MedicalVisit.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: "Medical visit not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Medical visit updated successfully",
      data: visit
    });
  } catch (error) {
    console.error("Error updating visit:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update visit",
      error: error.message
    });
  }
};

// Delete a medical visit
export const deleteMedicalVisit = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid visit ID format"
      });
    }

    const visit = await MedicalVisit.findByIdAndDelete(id);

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: "Medical visit not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Medical visit deleted successfully",
      data: visit
    });
  } catch (error) {
    console.error("Error deleting visit:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete visit",
      error: error.message
    });
  }
};
