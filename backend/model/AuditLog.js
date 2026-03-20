import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  timestamp: { type: Date, default: Date.now },
  details: { type: String }
});

const AuditLog = mongoose.model("AuditLog", auditLogSchema);
export default AuditLog;