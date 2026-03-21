import GrowthRecord from "../model/GrowthRecord.js";
import mongoose from "mongoose";

// Get growth analytics for a child
export const getGrowthAnalytics = async (req, res) => {
  try {
    const { childId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(childId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid child ID format"
      });
    }

    const records = await GrowthRecord.find({ childId })
      .sort({ date: 1 });

    if (records.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No growth records found",
        data: {
          averageHeight: 0,
          averageWeight: 0,
          averageBMI: 0,
          heightTrend: [],
          weightTrend: [],
          bmiTrend: [],
          totalRecords: 0
        }
      });
    }

    // Calculate averages
    const totalHeight = records.reduce((sum, r) => sum + (r.height || 0), 0);
    const totalWeight = records.reduce((sum, r) => sum + (r.weight || 0), 0);
    const totalBMI = records.reduce((sum, r) => sum + (r.bmi || 0), 0);

    const validHeightCount = records.filter(r => r.height).length;
    const validWeightCount = records.filter(r => r.weight).length;
    const validBMICount = records.filter(r => r.bmi).length;

    const averageHeight = validHeightCount > 0 ? (totalHeight / validHeightCount).toFixed(2) : 0;
    const averageWeight = validWeightCount > 0 ? (totalWeight / validWeightCount).toFixed(2) : 0;
    const averageBMI = validBMICount > 0 ? (totalBMI / validBMICount).toFixed(2) : 0;

    // Prepare trends
    const heightTrend = records.filter(r => r.height).map(r => ({
      date: r.date,
      value: r.height
    }));

    const weightTrend = records.filter(r => r.weight).map(r => ({
      date: r.date,
      value: r.weight
    }));

    const bmiTrend = records.filter(r => r.bmi).map(r => ({
      date: r.date,
      value: r.bmi
    }));

    res.status(200).json({
      success: true,
      data: {
        averageHeight: parseFloat(averageHeight),
        averageWeight: parseFloat(averageWeight),
        averageBMI: parseFloat(averageBMI),
        heightTrend,
        weightTrend,
        bmiTrend,
        totalRecords: records.length
      }
    });
  } catch (error) {
    console.error("Error fetching growth analytics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch growth analytics",
      error: error.message
    });
  }
};
