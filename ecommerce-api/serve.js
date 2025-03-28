// const express = require('express');
// const dotenv = require('dotenv');
// const mongoose = require('mongoose'); // ✅ استيراد mongoose
// const bcrypt = require('bcrypt'); // ✅ استيراد bcrypt
// const connectDB = require('./config/db');
// const routes = require('./routes');

// dotenv.config();

// // اتصال قاعدة البيانات
// connectDB();

// const app = express();
// app.use("/api/admin/auth", require("./routes/adminAuth"));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));



// app.use(express.json());

// const UserSchema = new mongoose.Schema({
//   name: String,
//   email: { type: String, unique: true },
//   password: String,
//   role: { type: String, default: 'admin' }
// });

// const User = require('./models/User.js');

// const createAdmin = async () => {
//   try {
//     const existingAdmin = await User.findOne({ email: "admin@example.com" });
//     if (existingAdmin) {
//       console.log("Admin user already exists");
//       return;
//     }

//     const hashedPassword = await bcrypt.hash("admin123", 10);
//     const adminUser = new User({
//       name: "Admin",
//       email: "admin@example.com",
//       password: hashedPassword,
//       role: "admin"
//     });

//     await adminUser.save();
//     console.log("Admin user created successfully");
//   } catch (error) {
//     console.error("Error creating admin user:", error);
//   }
// };

// createAdmin();

// // المسارات
// app.use('/api', routes);

// // تشغيل الخادم
// const PORT = process.env.PORT || 3030;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });




const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();


dotenv.config();
connectDB();

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the uploads directory
app.use('/uploads', express.static('uploads'));

app.use(cors());
const adminAuthRoutes = require("./routes/adminAuth");

app.use("/api/admin", adminAuthRoutes);
const categoryRoutes = require("./routes/categoryRoutes");


app.use(cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));



const promoRoutes = require("./routes/promoRoutes");
console.log("Promo Routes Loaded:", promoRoutes);
app.use("/api/admin/promos", promoRoutes);


const adRoutes = require("./routes/adRoutes");
console.log("Promo Routes Loaded:", adRoutes);
app.use("/api/admin/ads", adRoutes);



const orderRoutes = require("./routes/orderRoutes");
console.log("Promo Routes Loaded:", orderRoutes);
app.use("/api/orders", orderRoutes);


const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);


app.use("/api/admin/categories", categoryRoutes);

app.use("/api/admin/products", require("./routes/productRoutes"))
app.use("/api/admin/auth", require("./routes/adminAuth"));

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
























//  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Y2JhZmYyZGRlOTQ2ZTIyYWNhNjdjZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0MTQ0MzMwMiwiZXhwIjoxNzQxNTI5NzAyfQ.WEFIo4GOnGQUx7WEepfrvVatJjvTp7bO2LQmUytQ37Y