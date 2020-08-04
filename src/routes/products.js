const express = require('express');
const Product = require('../models/product.model');

const router = express.Router();

router.get('/', async (req, res) => {
  const products = await Product.find({});
  res.send(products);
});

module.exports = router;
