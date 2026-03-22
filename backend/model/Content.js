import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: false
    },
    content: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ["article", "tip", "guide", "nutrition", "health", "care"],
      default: "article"
    },
    author: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    rejectionReason: {
      type: String,
      default: null
    },
    tags: [{
      type: String
    }],
    category: {
      type: String,
      default: "general"
    },
    views: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const Content = mongoose.model("Content", contentSchema);
export default Content;
