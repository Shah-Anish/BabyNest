import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
  visitId: { type: mongoose.Schema.Types.ObjectId, ref: "MedicalVisit", required: true },
  medication: [{ name: String, dose: String, duration: String }],
  instructions: { type: String }
}, { timestamps: true });

const Prescription = mongoose.model("Prescription", prescriptionSchema);
export default Prescription;