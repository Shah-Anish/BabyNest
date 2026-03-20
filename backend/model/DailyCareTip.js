import mongoose from "mongoose";

const dailyCareTipSchema = new mongoose.Schema({
  ageInMonths: { type: Number, required: true },
  tip: { type: String, required: true }
}, { timestamps: true });

const DailyCareTip = mongoose.model("DailyCareTip", dailyCareTipSchema);
export default DailyCareTip;