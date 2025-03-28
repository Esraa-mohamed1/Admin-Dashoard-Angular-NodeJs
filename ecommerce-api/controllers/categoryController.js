// const Category = require('../models/Category.js');
// const { verifyAdmin } = require('../middleware/authMiddleware.js');

// // إنشاء فئة جديدة
// exports.createCategory = [verifyAdmin, async (req, res) => {
//   try {
//     const { name, description } = req.body;
//     if (!name) {
//       return res.status(400).json({ error: "Category name is required" });
//     }
//     const existingCategory = await Category.findOne({ name });
//     if (existingCategory) {
//       return res.status(400).json({ error: "Category already exists" });
//     }

//     const category = new Category({ name, description });
//     await category.save();

//     res.status(201).json({ message: "Category created successfully", category });
//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error", details: error.message });
//   }
// }];

// // جلب جميع الفئات مع البحث
// exports.getCategories = async (req, res) => {
//   try {
//     const { search } = req.query;
//     const query = search ? { name: { $regex: search, $options: 'i' } } : {};
//     const categories = await Category.find(query).sort({ createdAt: -1 }); // ترتيب تنازلي حسب الأحدث
//     res.status(200).json(categories);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch categories", details: error.message });
//   }
// };

// // تحديث فئة موجودة
// exports.updateCategory = [verifyAdmin, async (req, res) => {
//   try {
//     const { name, description } = req.body;
//     const category = await Category.findById(req.params.id);
    
//     if (!category) {
//       return res.status(404).json({ error: "Category not found" });
//     }

//     category.name = name || category.name;
//     category.description = description || category.description;
    
//     await category.save();
//     res.status(200).json({ message: "Category updated successfully", category });
//   } catch (error) {
//     res.status(500).json({ error: "Error updating category", details: error.message });
//   }
// }];

// // حذف فئة
// exports.deleteCategory = [verifyAdmin, async (req, res) => {
//   try {
//     const category = await Category.findById(req.params.id);
    
//     if (!category) {
//       return res.status(404).json({ error: "Category not found" });
//     }

//     await category.deleteOne();
//     res.status(200).json({ message: "Category deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: "Error deleting category", details: error.message });
//   }
// }];




//trying to solve category errror 

const Category = require("../models/Category");
const path = require('path');

const createCategory = async (req, res) => {
  try {
    const categoryData = {
      name: req.body.name,
      description: req.body.description
    };
    
    // Add image URL if a file was uploaded
    if (req.file) {
      // Convert backslashes to forward slashes for URLs
      const relativePath = req.file.path.replace(/\\/g, '/');
      categoryData.image = `${req.protocol}://${req.get('host')}/${relativePath}`;
    }
    
    const category = await Category.create(categoryData);
    res.status(201).json({ message: "Category created successfully", category });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const categoryData = {
      name: req.body.name,
      description: req.body.description
    };
    
    // Add image URL if a file was uploaded
    if (req.file) {
      // Convert backslashes to forward slashes for URLs
      const relativePath = req.file.path.replace(/\\/g, '/');
      categoryData.image = `${req.protocol}://${req.get('host')}/${relativePath}`;
    }
    
    const category = await Category.findByIdAndUpdate(
      req.params.id, 
      categoryData, 
      { new: true }
    );
    
    res.json({ message: "Category updated successfully", category });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = { createCategory, getCategories, updateCategory, deleteCategory };
