import mongoose from "mongoose";

const childProfileSchema = new mongoose.Schema(
{
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: { type: String, required: true },
  birthDate: { type: Date, required: true },
  gender: { type: String, enum: ["male", "female", "other"], required: true },
  medicalConditions: [{ type: String }],
  allergies: [{ type: String }],
},
{
  timestamps: true
});

const ChildProfile = mongoose.model("ChildProfile", childProfileSchema);
export default ChildProfile;