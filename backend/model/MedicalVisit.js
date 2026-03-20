import mongoose from "mongoose";

const medicalVisitSchema = new mongoose.Schema({
  childId: { type: mongoose.Schema.Types.ObjectId, ref: "ChildProfile", required: true },
  doctorName: { type: String, required: true },
  visitDate: { type: Date, required: true },
  notes: { type: String }
}, { timestamps: true });

const MedicalVisit = mongoose.model("MedicalVisit", medicalVisitSchema);
export default MedicalVisit;