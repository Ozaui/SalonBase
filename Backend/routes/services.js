const express = require("express");
const { body } = require("express-validator");
const Service = require("../models/Service");
const asyncHandler = require("../utils/asyncHandler");
const { protect, authorize } = require("../middleware/auth");
const { handleValidationErrors } = require("../middleware/validation");

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

// @desc    Get all services
// @route   GET /api/services
// @access  Private
const getServices = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;

  const filter = {};
  if (req.query.isActive !== undefined)
    filter.isActive = req.query.isActive === "true";
  if (req.query.category) filter.category = req.query.category;
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: "i" } },
      { description: { $regex: req.query.search, $options: "i" } },
    ];
  }

  const total = await Service.countDocuments(filter);
  const services = await Service.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(startIndex);

  res.json({
    success: true,
    data: {
      services,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Private
const getService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return res.status(404).json({
      success: false,
      message: "Service not found",
    });
  }

  res.json({
    success: true,
    data: { service },
  });
});

// @desc    Create service
// @route   POST /api/services
// @access  Private/Admin
const createService = asyncHandler(async (req, res) => {
  const { name, description, duration, price, category } = req.body;

  const service = await Service.create({
    name,
    description,
    duration,
    price,
    category,
  });

  res.status(201).json({
    success: true,
    data: { service },
    message: "Service created successfully",
  });
});

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private/Admin
const updateService = asyncHandler(async (req, res) => {
  const { name, description, duration, price, isActive, category } = req.body;

  const service = await Service.findById(req.params.id);

  if (!service) {
    return res.status(404).json({
      success: false,
      message: "Service not found",
    });
  }

  service.name = name || service.name;
  service.description = description || service.description;
  service.duration = duration || service.duration;
  service.price = price || service.price;
  service.isActive = isActive !== undefined ? isActive : service.isActive;
  service.category = category || service.category;

  const updatedService = await service.save();

  res.json({
    success: true,
    data: { service: updatedService },
    message: "Service updated successfully",
  });
});

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private/Admin
const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return res.status(404).json({
      success: false,
      message: "Service not found",
    });
  }

  await service.deleteOne();

  res.json({
    success: true,
    message: "Service deleted successfully",
  });
});

// @desc    Get service statistics
// @route   GET /api/services/stats
// @access  Private/Admin
const getServiceStats = asyncHandler(async (req, res) => {
  const totalServices = await Service.countDocuments();
  const activeServices = await Service.countDocuments({ isActive: true });
  const inactiveServices = await Service.countDocuments({ isActive: false });

  // Get services by category
  const categoryStats = await Service.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
        avgPrice: { $avg: "$price" },
        avgDuration: { $avg: "$duration" },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);

  // Get average price and duration
  const avgPrice = await Service.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: null, avgPrice: { $avg: "$price" } } },
  ]);

  const avgDuration = await Service.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: null, avgDuration: { $avg: "$duration" } } },
  ]);

  res.json({
    success: true,
    data: {
      totalServices,
      activeServices,
      inactiveServices,
      categoryStats,
      avgPrice: avgPrice[0]?.avgPrice || 0,
      avgDuration: avgDuration[0]?.avgDuration || 0,
    },
  });
});

// Validation rules
const createServiceValidation = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Service name must be between 2 and 100 characters"),
  body("description")
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage("Description must be between 10 and 500 characters"),
  body("duration")
    .isInt({ min: 5, max: 480 })
    .withMessage("Duration must be between 5 and 480 minutes"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("category")
    .optional()
    .isIn(["hair", "nails", "facial", "massage", "other"])
    .withMessage("Invalid category"),
];

const updateServiceValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Service name must be between 2 and 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage("Description must be between 10 and 500 characters"),
  body("duration")
    .optional()
    .isInt({ min: 5, max: 480 })
    .withMessage("Duration must be between 5 and 480 minutes"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("category")
    .optional()
    .isIn(["hair", "nails", "facial", "massage", "other"])
    .withMessage("Invalid category"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

// Routes
router.get("/", getServices);
router.get("/stats", authorize("admin"), getServiceStats);
router.get("/:id", getService);
router.post(
  "/",
  authorize("admin"),
  createServiceValidation,
  handleValidationErrors,
  createService
);
router.put(
  "/:id",
  authorize("admin"),
  updateServiceValidation,
  handleValidationErrors,
  updateService
);
router.delete("/:id", authorize("admin"), deleteService);

module.exports = router;
