const express = require('express');
const categoryRoutes = require('./categoryRoutes.js');
const productRoutes = require('./productRoutes.js');
const router = express.Router();
const userRoutes = require('./userRoutes.js');
const adRoutes = require('./adRoutes');

const orderRoutes = require('./orderRoutes.js')
const promoRoutes = require ('./promoRoutes.js')
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/promos', promoRoutes);
router.use('/ads', adRoutes);


module.exports = router;
