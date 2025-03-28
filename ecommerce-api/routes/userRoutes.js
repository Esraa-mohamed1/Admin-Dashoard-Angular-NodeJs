const express = require("express");
const { createUser, getUsers, updateUser, deleteUser } = require("../controllers/userController");
const verifyAdmin = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", createUser);
router.get("/", verifyAdmin, getUsers);
router.put("/:id", verifyAdmin, updateUser);
router.delete("/:id", verifyAdmin, deleteUser);

module.exports = router;
