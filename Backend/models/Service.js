const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
      maxlength: [100, "Service name cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Service description is required"],
      trim: true,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    duration: {
      type: Number,
      required: [true, "Service duration is required"],
      min: [5, "Duration must be at least 5 minutes"],
      max: [480, "Duration cannot exceed 8 hours"],
    },
    price: {
      type: Number,
      required: [true, "Service price is required"],
      min: [0, "Price cannot be negative"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    category: {
      type: String,
      enum: ["hair", "nails", "facial", "massage", "other"],
      default: "other",
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
serviceSchema.index({ isActive: 1 });
serviceSchema.index({ category: 1 });
serviceSchema.index({ name: "text", description: "text" });

// Virtual for formatted duration
serviceSchema.virtual("durationFormatted").get(function () {
  const hours = Math.floor(this.duration / 60);
  const minutes = this.duration % 60;

  if (hours > 0) {
    return `${hours}h ${minutes > 0 ? `${minutes}m` : ""}`.trim();
  }
  return `${minutes}m`;
});

// Ensure virtual fields are serialized
serviceSchema.set("toJSON", { virtuals: true });
serviceSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Service", serviceSchema);
