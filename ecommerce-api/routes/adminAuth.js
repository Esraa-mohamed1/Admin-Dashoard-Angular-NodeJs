// const express = require("express");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// const router = express.Router();

// // ✅ تأكد من استيراد `verifyToken` بدون `{}` أو `[]`
// const verifyToken = require("../middleware/authMiddleware");

// router.get("/dashboard", verifyToken, (req, res) => {
//   res.json({ message: "Welcome to Admin Dashboard", user: req.user });
// });

// router.post("/login", async (req, res) => {
//   console.log("Request Body:", req.body); // ✅ فحص البيانات المستقبلة

//   if (!req.body) {
//     return res.status(400).json({ message: "Request body is missing" });
//   }

//   const { email, password } = req.body;
//   if (!email || !password) {
//     return res.status(400).json({ message: "Email and password are required" });
//   }

//   const admin = await User.findOne({ email, role: "admin" });
//   if (!admin || !(await bcrypt.compare(password, admin.password))) {
//     return res.status(401).json({ message: "Invalid credentials" });
//   }

//   const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1d" });
//   res.json({ token });
// });


// // const verifyToken = require("../middleware/authMiddleware");

// console.log("verifyToken:", verifyToken); // ✅ هذا سيطبع محتوى `verifyToken`

// module.exports = router; // ✅ تأكد من التصدير الصحيح



//trying to solve the errrrrrror


const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ✅ الاستيراد الصحيح
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/dashboard", verifyToken, (req, res) => {
  res.json({ message: "Welcome to Admin Dashboard", user: req.user });
});

router.post("/login", async (req, res) => {
  console.log("Request Body:", req.body); // ✅ فحص البيانات المستقبلة

  if (!req.body) {
    return res.status(400).json({ message: "Request body is missing" });
  }

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const admin = await User.findOne({ email, role: "admin" });
  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.json({ token });
});

module.exports = router; // ✅ تأكد من التصدير الصحيح
