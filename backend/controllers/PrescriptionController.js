import Prescription from "../model/Prescription.js";
import mongoose from "mongoose";

// Add a new prescription
export const addPrescription = async (req, res) => {
  try {
    const { visitId, medication, instructions } = req.body;

    if (!visitId || !medication || medication.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide visitId and medication"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(visitId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid visit ID format"
      });
    }

    const prescription = await Prescription.create({
      visitId,
      medication,
      instructions
    });

    res.status(201).json({
      success: true,
      message: "Prescription created successfully",
      data: prescription
    });
  } catch (error) {
    console.error("Error creating prescription:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create prescription",
      error: error.message
    });
  }
};

// Get all prescriptions by visit ID
export const getPrescriptionsByVisit = async (req, res) => {
  try {
    const { visitId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(visitId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid visit ID format"
      });
    }

    const prescriptions = await Prescription.find({ visitId })
      .populate("visitId", "doctorName visitDate");

    res.status(200).json({
      success: true,
      count: prescriptions.length,
      data: prescriptions
    });
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch prescriptions",
      error: error.message
    });
  }
};

// Update a prescription
export const updatePrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid prescription ID format"
      });
    }

    if (updateData.visitId) {
      return res.status(400).json({
        success: false,
        message: "Visit ID cannot be updated"
      });
    }

    const prescription = await Prescription.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Prescription updated successfully",
      data: prescription
    });
  } catch (error) {
    console.error("Error updating prescription:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update prescription",
      error: error.message
    });
  }
};

// Delete a prescription
export const deletePrescription = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid prescription ID format"
      });
    }

    const prescription = await Prescription.findByIdAndDelete(id);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Prescription deleted successfully",
      data: prescription
    });
  } catch (error) {
    console.error("Error deleting prescription:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete prescription",
      error: error.message
    });
  }
};
