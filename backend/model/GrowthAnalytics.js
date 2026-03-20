import mongoose from "mongoose";

const growthAnalyticsSchema = new mongoose.Schema({
  childId: { type: mongoose.Schema.Types.ObjectId, ref: "ChildProfile", required: true },
  averageHeight: { type: Number },
  averageWeight: { type: Number },
  bmiTrend: [{ date: Date, bmi: Number }]
}, { timestamps: true });

const GrowthAnalytics = mongoose.model("GrowthAnalytics", growthAnalyticsSchema);
export default GrowthAnalytics;