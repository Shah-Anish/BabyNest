import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  childId: { type: mongoose.Schema.Types.ObjectId, ref: "ChildProfile", required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true }, // e.g., "Doctor Checkup", "Vaccination", "Dental Appointment"
  date: { type: Date, required: true },
  time: { type: String }, // e.g., "10:30 AM", "2:45 PM"
  location: { type: String }, // e.g., "City Hospital", "Dr. Smith's Clinic"
  doctorName: { type: String }, // Name of the healthcare provider
  notes: { type: String }, // Additional notes or instructions
  reminders: { type: Boolean, default: true }, // Whether to send reminders
  status: { type: String, enum: ["scheduled", "completed", "cancelled"], default: "scheduled" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
