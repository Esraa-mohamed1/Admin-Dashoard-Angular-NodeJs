const Ad = require("../models/Ad");

const createAd = async (req, res) => {
  try {
    const ad = await Ad.create(req.body);
    res.status(201).json(ad);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAds = async (req, res) => {
  try {
    const ads = await Ad.find();
    res.json(ads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateAd = async (req, res) => {
  try {
    const ad = await Ad.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }
    res.json(ad);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteAd = async (req, res) => {
  try {
    const ad = await Ad.findByIdAndDelete(req.params.id);
    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }
    res.json({ message: "Ad deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createAd, getAds, updateAd, deleteAd };
