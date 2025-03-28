const Product = require('../models/Product.js');




const createProduct = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("File Received:", req.file);

    const imageUrl = req.file ? `/Pictures/${req.file.filename}` : null;

    const product = await Product.create({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock,
      image: imageUrl,
    });

    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    console.error("Error Creating Product:", error.message);
    res.status(400).json({ error: error.message });
  }
};     // yhis way i am saving the imgs in folder on my db but after searching this folder gonna effect on my web performance or i can lost it if i upload the d on server and updated so 
//perfect ways to uplaod is using Cloudinary and firease and 


const getProducts = async (req, res) => {
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

// const updateProduct = async (req, res) => {
//   try {
//     const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json(product);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };





const updateProduct = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("File Received:", req.file); 

    const imageUrl = req.file ? `/Pictures/${req.file.filename}` : null; 

    const product = await Product.create({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock,
      image: imageUrl, 
    });

    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    console.error("Error Creating Product:", error.message);
    res.status(400).json({ error: error.message });
  }
};






const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createProduct, getProducts, updateProduct, deleteProduct };
