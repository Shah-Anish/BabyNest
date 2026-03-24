import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  childId: { type: mongoose.Schema.Types.ObjectId, ref: "ChildProfile" },
  type: { type: String, enum: ["vaccine", "appointment", "medication"], required: true },
  message: { type: String, required: true },
  remindAt: { type: Date, required: true },
  isSent: { type: Boolean, default: false },

  // Advance notification fields
  isAdvanceNotification: { type: Boolean, default: false },
  notificationStage: {
    type: String,
    enum: ["1_week", "1_day", "main"],
    default: "main"
  },
  parentReminderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reminder",
    default: null
  },

  // Original reminder date (for advance notifications)
  originalRemindAt: { type: Date }
}, { timestamps: true });

const Reminder = mongoose.model("Reminder", reminderSchema);
export default Reminder;