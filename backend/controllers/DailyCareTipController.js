import DailyCareTip from "../model/DailyCareTip.js";
import mongoose from "mongoose";

// Create a new daily care tip (Admin)
export const createTip = async (req, res) => {
  try {
    const { ageInMonths, tip } = req.body;

    if (!ageInMonths || !tip) {
      return res.status(400).json({
        success: false,
        message: "Please provide ageInMonths and tip"
      });
    }

    const careTip = await DailyCareTip.create({
      ageInMonths,
      tip
    });

    res.status(201).json({
      success: true,
      message: "Daily care tip created successfully",
      data: careTip
    });
  } catch (error) {
    console.error("Error creating tip:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create daily care tip",
      error: error.message
    });
  }
};

// Get all daily care tips
export const getTips = async (req, res) => {
  try {
    const { ageInMonths } = req.query;

    let filter = {};
    if (ageInMonths) {
      filter.ageInMonths = ageInMonths;
    }

    const tips = await DailyCareTip.find(filter)
      .sort({ ageInMonths: 1 });

    res.status(200).json({
      success: true,
      count: tips.length,
      data: tips
    });
  } catch (error) {
    console.error("Error fetching tips:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch daily care tips",
      error: error.message
    });
  }
};

// Update a daily care tip (Admin)
export const updateTip = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid tip ID format"
      });
    }

    const tip = await DailyCareTip.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!tip) {
      return res.status(404).json({
        success: false,
        message: "Daily care tip not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Daily care tip updated successfully",
      data: tip
    });
  } catch (error) {
    console.error("Error updating tip:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update daily care tip",
      error: error.message
    });
  }
};

// Delete a daily care tip (Admin)
export const deleteTip = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid tip ID format"
      });
    }

    const tip = await DailyCareTip.findByIdAndDelete(id);

    if (!tip) {
      return res.status(404).json({
        success: false,
        message: "Daily care tip not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Daily care tip deleted successfully",
      data: tip
    });
  } catch (error) {
    console.error("Error deleting tip:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete daily care tip",
      error: error.message
    });
  }
};
