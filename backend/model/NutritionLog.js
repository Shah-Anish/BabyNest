import mongoose from "mongoose";

const nutritionLogSchema = new mongoose.Schema({
  childId: { type: mongoose.Schema.Types.ObjectId, ref: "ChildProfile", required: true },
  type: { 
    type: String, 
    enum: ["feeding", "water", "snack", "meal", "supplement"],
    required: true 
  },
  title: { type: String },
  details: { type: String },
  timestamp: { type: Date, required: true }
}, { timestamps: true });

const NutritionLog = mongoose.model("NutritionLog", nutritionLogSchema);
export default NutritionLog;
