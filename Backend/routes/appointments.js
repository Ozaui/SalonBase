const express = require("express");
const { body } = require("express-validator");
const Appointment = require("../models/Appointment");
const Service = require("../models/Service");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { protect, authorize } = require("../middleware/auth");
const { handleValidationErrors } = require("../middleware/validation");

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

// @desc    Get all appointments (admin only)
// @route   GET /api/appointments
// @access  Private/Admin
const getAppointments = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;

  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.date) {
    const date = new Date(req.query.date);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    filter.date = { $gte: date, $lt: nextDay };
  }
  if (req.query.search) {
    filter.$or = [
      { userName: { $regex: req.query.search, $options: "i" } },
      { service: { $regex: req.query.search, $options: "i" } },
    ];
  }

  const total = await Appointment.countDocuments(filter);
  const appointments = await Appointment.find(filter)
    .populate("userId", "name email phone")
    .populate("serviceId", "name price duration")
    .sort({ date: 1, time: 1 })
    .limit(limit)
    .skip(startIndex);

  res.json({
    success: true,
    data: {
      appointments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

// @desc    Get user appointments
// @route   GET /api/appointments/user/:userId
// @access  Private
const getUserAppointments = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Check if user is requesting their own appointments or is admin
  if (req.user.role !== "admin" && req.user.id !== userId) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to access these appointments",
    });
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;

  const filter = { userId };
  if (req.query.status) filter.status = req.query.status;
  if (req.query.date) {
    const date = new Date(req.query.date);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    filter.date = { $gte: date, $lt: nextDay };
  }

  const total = await Appointment.countDocuments(filter);
  const appointments = await Appointment.find(filter)
    .populate("serviceId", "name price duration")
    .sort({ date: 1, time: 1 })
    .limit(limit)
    .skip(startIndex);

  res.json({
    success: true,
    data: {
      appointments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
const getAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate("userId", "name email phone")
    .populate("serviceId", "name price duration");

  if (!appointment) {
    return res.status(404).json({
      success: false,
      message: "Appointment not found",
    });
  }

  // Check if user is authorized to view this appointment
  if (
    req.user.role !== "admin" &&
    appointment.userId.toString() !== req.user.id
  ) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to access this appointment",
    });
  }

  res.json({
    success: true,
    data: { appointment },
  });
});

// @desc    Create appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = asyncHandler(async (req, res) => {
  const { service, serviceId, date, time, notes } = req.body;

  // Validate appointment date is in the future
  const appointmentDate = new Date(date);
  if (appointmentDate <= new Date()) {
    return res.status(400).json({
      success: false,
      message: "Appointment date must be in the future",
    });
  }

  // Check for time conflicts if serviceId is provided
  if (serviceId) {
    const serviceDoc = await Service.findById(serviceId);
    if (!serviceDoc) {
      return res.status(400).json({
        success: false,
        message: "Service not found",
      });
    }

    // Check for overlapping appointments
    const appointmentDateTime = new Date(date);
    const [hours, minutes] = time.split(":");
    appointmentDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const endTime = new Date(
      appointmentDateTime.getTime() + serviceDoc.duration * 60000
    );

    const conflictingAppointment = await Appointment.findOne({
      date: appointmentDate,
      status: { $nin: ["cancelled"] },
      $or: [
        {
          time: { $lt: endTime.toTimeString().slice(0, 5) },
          $expr: {
            $gt: [
              {
                $add: [
                  { $multiply: [{ $toInt: { $substr: ["$time", 0, 2] } }, 60] },
                  { $toInt: { $substr: ["$time", 3, 2] } },
                ],
              },
              {
                $subtract: [
                  {
                    $add: [
                      { $multiply: [parseInt(hours), 60] },
                      parseInt(minutes),
                    ],
                  },
                  serviceDoc.duration,
                ],
              },
            ],
          },
        },
      ],
    });

    if (conflictingAppointment) {
      return res.status(400).json({
        success: false,
        message: "Time slot is not available",
      });
    }
  }

  const appointment = await Appointment.create({
    userId: req.user.id,
    userName: req.user.name,
    userPhone: req.user.phone,
    service,
    serviceId,
    date: appointmentDate,
    time,
    notes,
    price: serviceId ? (await Service.findById(serviceId)).price : 0,
    duration: serviceId ? (await Service.findById(serviceId)).duration : 60,
  });

  const populatedAppointment = await Appointment.findById(
    appointment._id
  ).populate("serviceId", "name price duration");

  res.status(201).json({
    success: true,
    data: { appointment: populatedAppointment },
    message: "Appointment created successfully",
  });
});

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointment = asyncHandler(async (req, res) => {
  const { service, date, time, status, notes } = req.body;

  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return res.status(404).json({
      success: false,
      message: "Appointment not found",
    });
  }

  // Check if user is authorized to update this appointment
  if (
    req.user.role !== "admin" &&
    appointment.userId.toString() !== req.user.id
  ) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to update this appointment",
    });
  }

  // Only admins can change status
  if (status && req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Only admins can change appointment status",
    });
  }

  if (date) {
    const appointmentDate = new Date(date);
    if (appointmentDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Appointment date must be in the future",
      });
    }
    appointment.date = appointmentDate;
  }

  appointment.service = service || appointment.service;
  appointment.time = time || appointment.time;
  appointment.status = status || appointment.status;
  appointment.notes = notes !== undefined ? notes : appointment.notes;

  const updatedAppointment = await appointment.save();

  const populatedAppointment = await Appointment.findById(
    updatedAppointment._id
  )
    .populate("userId", "name email phone")
    .populate("serviceId", "name price duration");

  res.json({
    success: true,
    data: { appointment: populatedAppointment },
    message: "Appointment updated successfully",
  });
});

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
const deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return res.status(404).json({
      success: false,
      message: "Appointment not found",
    });
  }

  // Check if user is authorized to delete this appointment
  if (
    req.user.role !== "admin" &&
    appointment.userId.toString() !== req.user.id
  ) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to delete this appointment",
    });
  }

  await appointment.deleteOne();

  res.json({
    success: true,
    message: "Appointment deleted successfully",
  });
});

// @desc    Get appointment statistics
// @route   GET /api/appointments/stats
// @access  Private/Admin
const getAppointmentStats = asyncHandler(async (req, res) => {
  const totalAppointments = await Appointment.countDocuments();
  const pendingAppointments = await Appointment.countDocuments({
    status: "pending",
  });
  const confirmedAppointments = await Appointment.countDocuments({
    status: "confirmed",
  });
  const completedAppointments = await Appointment.countDocuments({
    status: "completed",
  });
  const cancelledAppointments = await Appointment.countDocuments({
    status: "cancelled",
  });

  // Get appointments by date range
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayAppointments = await Appointment.countDocuments({
    date: { $gte: today, $lt: tomorrow },
  });

  const thisWeek = new Date();
  thisWeek.setDate(thisWeek.getDate() - 7);
  const weeklyAppointments = await Appointment.countDocuments({
    date: { $gte: thisWeek },
  });

  // Get revenue statistics
  const revenueStats = await Appointment.aggregate([
    { $match: { status: "completed" } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$price" },
        avgAppointmentValue: { $avg: "$price" },
      },
    },
  ]);

  res.json({
    success: true,
    data: {
      totalAppointments,
      pendingAppointments,
      confirmedAppointments,
      completedAppointments,
      cancelledAppointments,
      todayAppointments,
      weeklyAppointments,
      totalRevenue: revenueStats[0]?.totalRevenue || 0,
      avgAppointmentValue: revenueStats[0]?.avgAppointmentValue || 0,
    },
  });
});

// Validation rules
const createAppointmentValidation = [
  body("service")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Service name must be between 2 and 100 characters"),
  body("serviceId").optional().isMongoId().withMessage("Invalid service ID"),
  body("date").isISO8601().withMessage("Please enter a valid date"),
  body("time")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Please enter a valid time in HH:MM format"),
  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes cannot be more than 500 characters"),
];

const updateAppointmentValidation = [
  body("service")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Service name must be between 2 and 100 characters"),
  body("date").optional().isISO8601().withMessage("Please enter a valid date"),
  body("time")
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Please enter a valid time in HH:MM format"),
  body("status")
    .optional()
    .isIn(["pending", "confirmed", "cancelled", "completed"])
    .withMessage("Invalid status"),
  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes cannot be more than 500 characters"),
];

// Routes
router.get("/", authorize("admin"), getAppointments);
router.get("/stats", authorize("admin"), getAppointmentStats);
router.get("/user/:userId", getUserAppointments);
router.get("/:id", getAppointment);
router.post(
  "/",
  createAppointmentValidation,
  handleValidationErrors,
  createAppointment
);
router.put(
  "/:id",
  updateAppointmentValidation,
  handleValidationErrors,
  updateAppointment
);
router.delete("/:id", deleteAppointment);

module.exports = router;
