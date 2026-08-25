import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const themeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    author: {
      type: String,
      trim: true,
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // likes:[],
    images: [
      {
        type: String,
        required: true,
      },
    ],
    githubUrl: {
      type: String,
      required: true,
    },
    platform: {
      type: String,
      required: true,
      enum: ["Windows", "Linux", "MacOS"],
    },
  },
  { timestamps: true },
);

themeSchema.plugin(aggregatePaginate);

export const Theme = mongoose.model("Theme", themeSchema);
