import mongoose from "mongoose";

const vaccinationSchema = new mongoose.Schema({
  childId: { type: mongoose.Schema.Types.ObjectId, ref: "ChildProfile", required: true },
  name: { type: String, required: true },
  recommendedAge: { type: Number }, // in months
  status: { type: String, enum: ["pending", "completed", "overdue"], default: "pending" },
  administeredDate: { type: Date }
}, { timestamps: true });

const Vaccination = mongoose.model("Vaccination", vaccinationSchema);
export default Vaccination;