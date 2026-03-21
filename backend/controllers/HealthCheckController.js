import HealthCheck from "../model/HealthCheck.js";
import mongoose from "mongoose";

// Create a new health check
export const createHealthCheck = async (req, res) => {
  try {
    const { childId, date, status, notes } = req.body;

    if (!childId || !status) {
      return res.status(400).json({
        success: false,
        message: "Please provide childId and status"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(childId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid child ID format"
      });
    }

    const healthCheck = await HealthCheck.create({
      childId,
      date: date || Date.now(),
      status,
      notes
    });

    res.status(201).json({
      success: true,
      message: "Health check created successfully",
      data: healthCheck
    });
  } catch (error) {
    console.error("Error creating health check:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create health check",
      error: error.message
    });
  }
};

// Get all health checks by child ID
export const getHealthChecksByChild = async (req, res) => {
  try {
    const { childId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(childId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid child ID format"
      });
    }

    const healthChecks = await HealthCheck.find({ childId })
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: healthChecks.length,
      data: healthChecks
    });
  } catch (error) {
    console.error("Error fetching health checks:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch health checks",
      error: error.message
    });
  }
};

// Update a health check
export const updateHealthCheck = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid health check ID format"
      });
    }

    if (updateData.childId) {
      return res.status(400).json({
        success: false,
        message: "Child ID cannot be updated"
      });
    }

    const healthCheck = await HealthCheck.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!healthCheck) {
      return res.status(404).json({
        success: false,
        message: "Health check not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Health check updated successfully",
      data: healthCheck
    });
  } catch (error) {
    console.error("Error updating health check:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update health check",
      error: error.message
    });
  }
};

// Delete a health check
export const deleteHealthCheck = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid health check ID format"
      });
    }

    const healthCheck = await HealthCheck.findByIdAndDelete(id);

    if (!healthCheck) {
      return res.status(404).json({
        success: false,
        message: "Health check not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Health check deleted successfully",
      data: healthCheck
    });
  } catch (error) {
    console.error("Error deleting health check:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete health check",
      error: error.message
    });
  }
};
