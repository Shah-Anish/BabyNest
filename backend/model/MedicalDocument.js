import mongoose from "mongoose";

const medicalDocumentSchema = new mongoose.Schema({
  visitId: { type: mongoose.Schema.Types.ObjectId, ref: "MedicalVisit", required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String }
}, { timestamps: true });

const MedicalDocument = mongoose.model("MedicalDocument", medicalDocumentSchema);
export default MedicalDocument;