const express = require('express');
const categoryController = require('../controllers/categoryController.js');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Routes with file upload middleware
router.post('/', upload.single('image'), categoryController.createCategory);
router.get('/', categoryController.getCategories);
router.put('/:id', upload.single('image'), categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;

exports.getProducts = async (req, res) => {
  try {
    const { search, category } = req.query;
    const query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (category) query.category = category;

    const products = await Product.find(query).populate('category');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
