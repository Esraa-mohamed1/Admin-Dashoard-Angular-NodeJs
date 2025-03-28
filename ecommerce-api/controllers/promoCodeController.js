const Promo = require("../models/PromoCode.js");
const verifyAdmin = require("../middleware/authMiddleware.js");

const createPromo = async (req, res) => {
  try {
    const promo = await Promo.create(req.body);
    res.status(201).json(promo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getPromos = async (req, res) => {
  try {
    const promos = await Promo.find();
    res.json(promos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePromo = async (req, res) => {
  try {
    const promo = await Promo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(promo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deletePromo = async (req, res) => {
  try {
    await Promo.findByIdAndDelete(req.params.id);
    res.json({ message: "Promo deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createPromo, getPromos, updatePromo, deletePromo };
console.log("Exported Functions:", module.exports);
