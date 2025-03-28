const express = require("express");
const { createAd, getAds, updateAd, deleteAd } = require("../controllers/adController");
const verifyAdmin = require("../middleware/authMiddleware");

const router = express.Router();




const multer = require('multer');
const upload = multer({ limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB

const Ad = require('../models/Ad'); // تأكد من مسار الموديل




router.post("/", verifyAdmin, createAd);
router.get("/", getAds);
router.put("/:id", verifyAdmin, updateAd);
router.delete("/:id", verifyAdmin, deleteAd);




router.post('/', upload.single('image'), async (req, res) => {
    try {
      const { title, description } = req.body;
      const newAd = new Ad({
        title,
        description,
        imageUrl: req.file ? req.file.path : '',
      });
      await newAd.save();
      res.status(201).json(newAd);
    } catch (err) {
      res.status(500).json({ message: 'Error while uploading ad', error: err });
    }
  });
  



module.exports = router;
