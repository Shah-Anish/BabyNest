import mongoose from "mongoose";

const emergencyContactSchema = new mongoose.Schema({
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  relation: { type: String },
  phone: { type: String, required: true },
  email: { type: String },
  address: { type: String }
}, { timestamps: true });

const EmergencyContact = mongoose.model("EmergencyContact", emergencyContactSchema);
export default EmergencyContact;