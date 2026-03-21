import GrowthRecord from "../model/GrowthRecord.js";
import mongoose from "mongoose";

// Add a new growth record
export const addGrowthRecord = async (req, res) => {
  try {
    const { childId, date, height, weight } = req.body;

    if (!childId || !date) {
      return res.status(400).json({
        success: false,
        message: "Please provide childId and date"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(childId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid child ID format"
      });
    }

    // Calculate BMI if height and weight are provided
    let bmi = null;
    if (height && weight) {
      const heightInMeters = height / 100;
      bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);
    }

    const growthRecord = await GrowthRecord.create({
      childId,
      date,
      height,
      weight,
      bmi
    });

    res.status(201).json({
      success: true,
      message: "Growth record created successfully",
      data: growthRecord
    });
  } catch (error) {
    console.error("Error creating growth record:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create growth record",
      error: error.message
    });
  }
};

// Get all growth records by child ID
export const getGrowthRecordsByChild = async (req, res) => {
  try {
    const { childId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(childId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid child ID format"
      });
    }

    const records = await GrowthRecord.find({ childId })
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    console.error("Error fetching growth records:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch growth records",
      error: error.message
    });
  }
};

// Update a growth record
export const updateGrowthRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid growth record ID format"
      });
    }

    if (updateData.childId) {
      return res.status(400).json({
        success: false,
        message: "Child ID cannot be updated"
      });
    }

    // Recalculate BMI if height or weight is updated
    if (updateData.height || updateData.weight) {
      const record = await GrowthRecord.findById(id);
      if (record) {
        const height = updateData.height || record.height;
        const weight = updateData.weight || record.weight;
        if (height && weight) {
          const heightInMeters = height / 100;
          updateData.bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);
        }
      }
    }

    const record = await GrowthRecord.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Growth record not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Growth record updated successfully",
      data: record
    });
  } catch (error) {
    console.error("Error updating growth record:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update growth record",
      error: error.message
    });
  }
};

// Delete a growth record
export const deleteGrowthRecord = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid growth record ID format"
      });
    }

    const record = await GrowthRecord.findByIdAndDelete(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Growth record not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Growth record deleted successfully",
      data: record
    });
  } catch (error) {
    console.error("Error deleting growth record:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete growth record",
      error: error.message
    });
  }
};
