import Vaccination from "../model/Vaccination.js";
import mongoose from "mongoose";

// Add a new vaccination record
export const addVaccination = async (req, res) => {
  try {
    const { childId, name, recommendedAge, status, administeredDate } = req.body;

    if (!childId || !name) {
      return res.status(400).json({
        success: false,
        message: "Please provide childId and name"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(childId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid child ID format"
      });
    }

    const vaccination = await Vaccination.create({
      childId,
      name,
      recommendedAge,
      status: status || "pending",
      administeredDate
    });

    res.status(201).json({
      success: true,
      message: "Vaccination record created successfully",
      data: vaccination
    });
  } catch (error) {
    console.error("Error creating vaccination:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create vaccination record",
      error: error.message
    });
  }
};

// Get all vaccinations by child ID
export const getVaccinationsByChild = async (req, res) => {
  try {
    const { childId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(childId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid child ID format"
      });
    }

    const vaccinations = await Vaccination.find({ childId })
      .sort({ recommendedAge: 1 });

    res.status(200).json({
      success: true,
      count: vaccinations.length,
      data: vaccinations
    });
  } catch (error) {
    console.error("Error fetching vaccinations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch vaccinations",
      error: error.message
    });
  }
};

// Update vaccination status
export const updateVaccinationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, administeredDate } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vaccination ID format"
      });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (administeredDate) updateData.administeredDate = administeredDate;

    const vaccination = await Vaccination.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!vaccination) {
      return res.status(404).json({
        success: false,
        message: "Vaccination record not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Vaccination status updated successfully",
      data: vaccination
    });
  } catch (error) {
    console.error("Error updating vaccination:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update vaccination",
      error: error.message
    });
  }
};

// Delete a vaccination record
export const deleteVaccination = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vaccination ID format"
      });
    }

    const vaccination = await Vaccination.findByIdAndDelete(id);

    if (!vaccination) {
      return res.status(404).json({
        success: false,
        message: "Vaccination record not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Vaccination record deleted successfully",
      data: vaccination
    });
  } catch (error) {
    console.error("Error deleting vaccination:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete vaccination",
      error: error.message
    });
  }
};
