import mongoose from "mongoose";

const growthRecordSchema = new mongoose.Schema({
  childId: { type: mongoose.Schema.Types.ObjectId, ref: "ChildProfile", required: true },
  date: { type: Date, required: true },
  height: { type: Number }, // cm
  weight: { type: Number }, // kg
  bmi: { type: Number }
}, { timestamps: true });

const GrowthRecord = mongoose.model("GrowthRecord", growthRecordSchema);
export default GrowthRecord;