const Product = require('../models/product');

const {ObjectId} = require('mongodb');
exports.getAddProduct = (req, res, next) => {
  console.log(req.user);
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  })
};

exports.postAddProduct = (req, res, next) => {
  console.log('user    ', req.user);
  const title = req.body.title.trim();
  const imageUrl = req.body.imageUrl.trim();
  const price = Number(req.body.price.trim());
  const description = req.body.description.trim();
  const product = new Product(title, price, description, imageUrl, null, req.user._id);
  product
  .save()
  .then(result=>{
    console.log('Created product');
    res.redirect('/admin/products');
  })
  .catch(err=>console.log(err));
};

//mongoDB
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
  .then(product=> {
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
  })
  .catch(err=>console.log(err));
};

//mongoDB
exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  const product = new Product(updatedTitle, updatedPrice, updatedDesc, updatedImageUrl, prodId)
  product.save()
  .then(result=>{
    console.log('UPDATED PRODUCT');
    res.redirect('/admin/products');
  })
  .catch(err=>console.log(err));
};

//mongoDB
exports.getProducts = (req, res, next) => {
  Product.fetchAll()
  .then(products=> {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  })
  .catch(err=>console.log(err));
};

//mongoDB
exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId)
  .then(()=> {
    console.log('DESTROYED');
    res.redirect('/admin/products')
  })
  .catch(err=>console.log(err));
};