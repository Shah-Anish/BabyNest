import NutritionRecommendation from "../model/NutritionRecommendation.js";
import mongoose from "mongoose";

// Create a new nutrition recommendation (Admin)
export const createRecommendation = async (req, res) => {
  try {
    const { ageInMonths, dietTips } = req.body;

    if (!ageInMonths || !dietTips) {
      return res.status(400).json({
        success: false,
        message: "Please provide ageInMonths and dietTips"
      });
    }

    const recommendation = await NutritionRecommendation.create({
      ageInMonths,
      dietTips
    });

    res.status(201).json({
      success: true,
      message: "Nutrition recommendation created successfully",
      data: recommendation
    });
  } catch (error) {
    console.error("Error creating recommendation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create nutrition recommendation",
      error: error.message
    });
  }
};

// Get all nutrition recommendations
export const getRecommendations = async (req, res) => {
  try {
    const { ageInMonths } = req.query;

    let filter = {};
    if (ageInMonths) {
      filter.ageInMonths = ageInMonths;
    }

    const recommendations = await NutritionRecommendation.find(filter)
      .sort({ ageInMonths: 1 });

    res.status(200).json({
      success: true,
      count: recommendations.length,
      data: recommendations
    });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch nutrition recommendations",
      error: error.message
    });
  }
};

// Update a nutrition recommendation (Admin)
export const updateRecommendation = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid recommendation ID format"
      });
    }

    const recommendation = await NutritionRecommendation.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!recommendation) {
      return res.status(404).json({
        success: false,
        message: "Nutrition recommendation not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Nutrition recommendation updated successfully",
      data: recommendation
    });
  } catch (error) {
    console.error("Error updating recommendation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update nutrition recommendation",
      error: error.message
    });
  }
};

// Delete a nutrition recommendation (Admin)
export const deleteRecommendation = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid recommendation ID format"
      });
    }

    const recommendation = await NutritionRecommendation.findByIdAndDelete(id);

    if (!recommendation) {
      return res.status(404).json({
        success: false,
        message: "Nutrition recommendation not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Nutrition recommendation deleted successfully",
      data: recommendation
    });
  } catch (error) {
    console.error("Error deleting recommendation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete nutrition recommendation",
      error: error.message
    });
  }
};
