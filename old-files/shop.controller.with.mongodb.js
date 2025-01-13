const Product = require('../models/product');

//mongoDB
exports.getProducts = (req, res, next) => {
  Product.fetchAll()
  .then(products=> {
    console.log('shop products', products);
    res.render('shop/product-list', {
      pageTitle: 'All Products',
      path: '/products',
      prods: products,
    });
  })
  .catch(err=>console.log(err));
};

//mongoDB
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  
  Product.findById(prodId)
  .then(product => {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products',
    });
  })
  .catch(err=>console.log(err));
};

// mongoDB
exports.getIndex = (req, res, next) => {
  Product.fetchAll()
  .then(products=> {
    res.render('shop/index', {
      pageTitle: 'Shop',
      path: '/',
      prods: products,
    });
  })
  .catch(err=>console.log(err));
};

//mongoDB
exports.getCart = (req, res, next) => {
  req.user.getCart()
  .then(products=> {
    console.log(products);
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: products,
    });
  })
  .catch(err=>console.log(err));
};

//mongoDB
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
  .then(product=> {
    return req.user.addToCart(product);
  })
  .then(result=> {
    console.log(result);
    res.redirect('/cart');
  })
  .catch(err=>console.log(err))
}

//mongoDB
exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
  .deleteItemFromCart(prodId)
  .then(result=>{
    res.redirect('/cart');
  })
  .catch(err=>console.log(err));
}

//mongoDB
exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user.addOrder()
  .then(result=> {
    res.redirect('/orders');
  })
  .catch(err=>console.log(err))
}
//mongoDB
exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err => console.log(err));
};