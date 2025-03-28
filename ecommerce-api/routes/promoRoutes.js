const express = require("express");
const { createPromo, getPromos, updatePromo, deletePromo } = require("../controllers/promoCodeController");
const verifyAdmin = require("../middleware/authMiddleware");

const router = express.Router();


console.log("createPromo Function:", createPromo);

router.post("/", verifyAdmin, createPromo);
router.get("/", verifyAdmin,getPromos);
router.put("/:id", verifyAdmin, updatePromo);
router.delete("/:id", verifyAdmin, deletePromo);



module.exports = router;
