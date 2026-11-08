import mongoose from "mongoose";

const guideSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      trim: true,
    },
    generatedAt: {
      type: Date,
      required: true,
    },
    githubUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const Guide = mongoose.model("Guide", guideSchema);
