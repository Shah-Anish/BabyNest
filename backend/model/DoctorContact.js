import mongoose from "mongoose";

const doctorContactSchema = new mongoose.Schema({
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  specialization: { type: String },
  phone: { type: String, required: true },
  hospital: { type: String }
}, { timestamps: true });

const DoctorContact = mongoose.model("DoctorContact", doctorContactSchema);
export default DoctorContact;