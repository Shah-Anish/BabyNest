import mongoose from "mongoose";

const nutritionRecommendationSchema = new mongoose.Schema({
  ageInMonths: { type: Number, required: true },
  dietTips: { type: String, required: true }
}, { timestamps: true });

const NutritionRecommendation = mongoose.model("NutritionRecommendation", nutritionRecommendationSchema);
export default NutritionRecommendation;