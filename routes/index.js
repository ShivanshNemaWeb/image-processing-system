const productRoutes = require('./product');

const express = require('express');
const router = express.Router();

router.use('/product',productRoutes);

module.exports = router;