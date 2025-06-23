const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    userName: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
    },
    userPhone: {
      type: String,
      required: [true, "User phone is required"],
    },
    service: {
      type: String,
      required: [true, "Service is required"],
      trim: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },
    date: {
      type: Date,
      required: [true, "Appointment date is required"],
      validate: {
        validator: function (value) {
          return value > new Date();
        },
        message: "Appointment date must be in the future",
      },
    },
    time: {
      type: String,
      required: [true, "Appointment time is required"],
      match: [
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Please enter a valid time in HH:MM format",
      ],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot be more than 500 characters"],
    },
    duration: {
      type: Number,
      default: 60, // minutes
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
appointmentSchema.index({ userId: 1 });
appointmentSchema.index({ date: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ userId: 1, date: 1 });

// Virtual for formatted date and time
appointmentSchema.virtual("dateTime").get(function () {
  const date = new Date(this.date);
  const time = this.time;
  const dateTime = new Date(date);
  const [hours, minutes] = time.split(":");
  dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  return dateTime;
});

// Virtual for end time
appointmentSchema.virtual("endTime").get(function () {
  const dateTime = this.dateTime;
  const endTime = new Date(dateTime.getTime() + this.duration * 60000);
  return endTime.toTimeString().slice(0, 5);
});

// Ensure virtual fields are serialized
appointmentSchema.set("toJSON", { virtuals: true });
appointmentSchema.set("toObject", { virtuals: true });

// Pre-save middleware to populate user info if not provided
appointmentSchema.pre("save", async function (next) {
  if (this.isNew && this.userId && (!this.userName || !this.userPhone)) {
    try {
      const User = mongoose.model("User");
      const user = await User.findById(this.userId).select("name phone");
      if (user) {
        this.userName = this.userName || user.name;
        this.userPhone = this.userPhone || user.phone;
      }
    } catch (error) {
      // Continue even if user lookup fails
    }
  }
  next();
});

module.exports = mongoose.model("Appointment", appointmentSchema);
