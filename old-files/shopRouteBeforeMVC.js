const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();

const adminData = require('../routes/admin');

router.get('/', (req, res, next) => {
  // console.log('shop.js  ', adminData.products)
  const products = adminData.products;
  // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
  res.render('shop', {
    pageTitle: 'Shop',
    prods: products,
    path: '/',
    hasProducts: products.length > 0,
    activeShop: true,
    productCSS: true
  });
})

module.exports = router;