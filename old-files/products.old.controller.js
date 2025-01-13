const Product = require('../models/product');


exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    activeAddProduct: true,
    productCSS: true,
    formsCSS: true,
  })
};

exports.postAddProduct = (req, res, next) => {
  const product = new Product(req.body.title);
  product.save();
  console.log('--------', req.body);
  // products.push({title: req.body.title})
  res.redirect('/');
};
exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    console.log('=======', products);
    res.render('shop/product-list', {
      pageTitle: 'Shop',
      prods: products,
      path: '/',
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true
    });
  });
};