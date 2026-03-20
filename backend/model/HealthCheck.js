import mongoose from "mongoose";

const healthCheckSchema = new mongoose.Schema({
  childId: { type: mongoose.Schema.Types.ObjectId, ref: "ChildProfile" },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ["good", "average", "critical"], default: "good" },
  notes: { type: String }
}, { timestamps: true });

const HealthCheck = mongoose.model("HealthCheck", healthCheckSchema);
export default HealthCheck;