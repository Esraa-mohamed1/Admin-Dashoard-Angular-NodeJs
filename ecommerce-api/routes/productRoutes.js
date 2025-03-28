// const express = require('express');
// const router = express.Router();

// // ✅ تأكد أن المسار صحيح
// const { createProduct, getProducts, updateProduct, deleteProduct } = require("../controllers/productController");

// // ✅ تأكد من استيراد `verifyAdmin`
// const { verifyAdmin } = require("../middleware/authMiddleware");

// router.post("/add", verifyAdmin, createProduct);
// router.get("/", getProducts);
// router.put("/:id", verifyAdmin, updateProduct);
// router.delete("/:id", verifyAdmin, deleteProduct);

// module.exports = router; // ✅ تأكد من تصدير `router`





// const express = require('express');
// const { createProduct, getProducts, updateProduct, deleteProduct } = require("../controllers/productController");
// const { verifyAdmin } = require("../middleware/authMiddleware");

// const router = express.Router();

// router.post("/add", verifyAdmin, createProduct);
// router.get("/", getProducts);
// router.put("/:id", verifyAdmin, updateProduct);
// router.delete("/:id", verifyAdmin, deleteProduct);

// module.exports = router;


//trying to solve the errorrrrr

const express = require("express");
const { createProduct, getProducts, updateProduct, deleteProduct } = require("../controllers/productController");
const verifyAdmin = require("../middleware/authMiddleware"); 
const verifyToken = require("../middleware/authMiddleware");
const multer = require("multer");

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "Pictures/"); 
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname); 
    },
  });
  
  const upload = multer({ storage });
  
  router.post("/add", verifyAdmin, upload.single("image"), createProduct); 
  
router.get("/", getProducts);
router.put("/:id", verifyAdmin, updateProduct);
router.delete("/:id", verifyAdmin, deleteProduct);

module.exports = router;
