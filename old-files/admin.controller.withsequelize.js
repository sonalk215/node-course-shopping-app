const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  })
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title.trim();
  const imageUrl = req.body.imageUrl.trim();
  const price = Number(req.body.price.trim());
  const description = req.body.description.trim();
  req.user.createProduct({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description,
  })
  .then(result=>{
    console.log('Created product');
    res.redirect('/admin/products');
  })
  .catch(err=>console.log(err));
};

//sequelized
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  req.user.getProducts({where: { id: prodId }})
  // Product.findByPk(prodId)
  .then(products=> {
    const product=products[0]
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

//sequelized
exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  Product.findByPk(prodId)
  .then(product=> {
    product.title=updatedTitle;
    product.price=updatedPrice;
    product.description=updatedDesc;
    product.imageUrl=updatedImageUrl;

    return product.save() //if doens texist xreate a new one, else replce with new values
  })
  .then(result=>{
    console.log('UPDATED PRODUCT');
    res.redirect('/admin/products');
  })
  .catch(err=>console.log(err));
};

//sequelized
exports.getProducts = (req, res, next) => {
  // Product.findAll()
  req.user.getProducts()
  .then(products=> {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  })
  .catch(err=>console.log(err));
};

//sequelized
exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
  .then(product=> {
    return product.destroy();
  })
  .then(result=> {
    console.log('DESTROYED');
    res.redirect('/admin/products')
  })
  .catch(err=>console.log(err));
};