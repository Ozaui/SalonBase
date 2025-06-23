const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Import models
const User = require("../models/User");
const Service = require("../models/Service");

// Sample data
const sampleUsers = [
  {
    name: "Admin User",
    email: "admin@salonbase.com",
    phone: "0555 123 4567",
    password: "admin123",
    role: "admin",
  },
  {
    name: "John Doe",
    email: "john@example.com",
    phone: "0555 123 4568",
    password: "user123",
    role: "user",
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "0555 123 4569",
    password: "user123",
    role: "user",
  },
];

const sampleServices = [
  {
    name: "Saç Kesimi & Şekillendirme",
    description:
      "Tüm saç tipleri için profesyonel saç kesimi ve şekillendirme hizmeti",
    duration: 60,
    price: 45.0,
    category: "hair",
    isActive: true,
  },
  {
    name: "Saç Boyama",
    description: "Premium ürünlerle tam saç boyama hizmeti",
    duration: 120,
    price: 85.0,
    category: "hair",
    isActive: true,
  },
  {
    name: "Manikür",
    description: "Tırnak şekillendirme ve oje ile klasik manikür",
    duration: 45,
    price: 25.0,
    category: "nails",
    isActive: true,
  },
  {
    name: "Pedikür",
    description: "Ayak masajı ve oje ile rahatlatıcı pedikür",
    duration: 60,
    price: 35.0,
    category: "nails",
    isActive: true,
  },
  {
    name: "Cilt Bakımı",
    description: "Nemlendirici maske ile derin temizlik cilt bakımı",
    duration: 75,
    price: 55.0,
    category: "facial",
    isActive: true,
  },
  {
    name: "İsveç Masajı",
    description: "Stres giderme için rahatlatıcı tam vücut masajı",
    duration: 90,
    price: 75.0,
    category: "massage",
    isActive: true,
  },
  {
    name: "Kaş Şekillendirme",
    description: "Profesyonel kaş şekillendirme ve boyama",
    duration: 30,
    price: 20.0,
    category: "other",
    isActive: true,
  },
  {
    name: "Makyaj Uygulama",
    description: "Özel günler için profesyonel makyaj uygulama",
    duration: 60,
    price: 65.0,
    category: "other",
    isActive: true,
  },
];

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/salonbase"
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

// Clear existing data
const clearData = async () => {
  try {
    await User.deleteMany({});
    await Service.deleteMany({});
    console.log("Existing data cleared");
  } catch (error) {
    console.error("Error clearing data:", error);
  }
};

// Seed users
const seedUsers = async () => {
  try {
    const hashedUsers = await Promise.all(
      sampleUsers.map(async (user) => {
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return {
          ...user,
          password: hashedPassword,
        };
      })
    );

    const users = await User.insertMany(hashedUsers);
    console.log(`${users.length} users seeded`);
    return users;
  } catch (error) {
    console.error("Error seeding users:", error);
  }
};

// Seed services
const seedServices = async () => {
  try {
    const services = await Service.insertMany(sampleServices);
    console.log(`${services.length} services seeded`);
    return services;
  } catch (error) {
    console.error("Error seeding services:", error);
  }
};

// Main seed function
const seedData = async () => {
  try {
    await connectDB();
    await clearData();
    await seedUsers();
    await seedServices();

    console.log("Database seeded successfully!");
    console.log("\nSample login credentials:");
    console.log("Admin: admin@salonbase.com / admin123");
    console.log("User: john@example.com / user123");
    console.log("User: jane@example.com / user123");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

// Run seed if this file is executed directly
if (require.main === module) {
  seedData();
}

module.exports = { seedData };
