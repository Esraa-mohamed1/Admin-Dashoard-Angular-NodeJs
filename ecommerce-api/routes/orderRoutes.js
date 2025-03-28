const express = require("express");
const { createOrder, getOrders, updateOrder, deleteOrder } = require("../controllers/ordersController");
const verifyAdmin = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", createOrder);
router.get("/", verifyAdmin, getOrders);
router.put("/:id", verifyAdmin, updateOrder);
router.delete("/:id", verifyAdmin, deleteOrder);

module.exports = router;
