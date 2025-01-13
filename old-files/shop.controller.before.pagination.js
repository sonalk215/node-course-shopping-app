const fs = require('fs');
const PDFDocument = require('pdfkit');
const path = require('path');
const Product = require('../models/product');
const Order = require('../models/order');

//mongoose
exports.getProducts = (req, res, next) => {
  Product.find()
  .then(products=> {
    res.render('shop/product-list', {
      pageTitle: 'All Products',
      path: '/products',
      prods: products,
      // isAuthenticated: req.session.isLoggedIn,
    });
  })
  .catch(err=>{
    const error= new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};

//mongoose
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  
  Product.findById(prodId)
  .then(product => {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products',
      // isAuthenticated: req.session.isLoggedIn,
    });
  })
  .catch(err=>{
    const error= new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};

// mongoose
exports.getIndex = (req, res, next) => {
  Product.find()
  .then(products=> {
    res.render('shop/index', {
      pageTitle: 'Shop',
      path: '/',
      prods: products,
    });
  })
  .catch(err=>{
    const error= new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};

//mongoose
exports.getCart = (req, res, next) => {
  req.user
  .populate('cart.items.productId')
  // .execPopulate()
  .then(user=> {
    const products=user.cart.items;
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: products,
    });
  })
  .catch(err=>{
    const error= new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};

//mongoose
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
  .then(product=> {
    return req.user.addToCart(product);
  })
  .then(result=> {
    res.redirect('/cart');
  })
  .catch(err=>{
    const error= new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  })
}

//mongoose
exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
  .removeFromCart(prodId)
  .then(result=>{
    res.redirect('/cart');
  })
  .catch(err=>console.log(err));
}

//mongoose
exports.postOrder = (req, res, next) => {
  req.user
  .populate('cart.items.productId')
  .then(user=> {
    const products=user.cart.items.map(i=>{
      return {quantity: i.quantity, product: {...i.productId._doc}}
    });
    const order = new Order({
      user: {
        email: req.user.email,
        userId: req.user,
      },
      products: products,
    });
    return order.save();
  })
  .then(result=> {
    return req.user.clearCart();
  })
  .then(() =>{
    res.redirect('/orders');
  })
  .catch(err=>console.log(err))
}
//mongoose
exports.getOrders = (req, res, next) => {
  Order.find({
    'user.userId': req.user._id
  })
  .then(orders => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders,
    });
  })
  .catch(err => console.log(err));
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
  .then(order => {
    if (!order) {
      return next(new Error('No order found!'));
    }
    if (order.user.userId.toString() !== req.user._id.toString()) {
      return next(new Error('Unauthorized!'));
    }
    const invoiceName = 'invoice-' + orderId+'.pdf';
    const invoicePath = path.join('data', 'invoices', invoiceName);
    const pdfDoc = new PDFDocument();  //readable steam
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');

    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(res);

    pdfDoc.fontSize(26).text('Invoice', {
      underline: true,
    });
    pdfDoc.text('---------------------------------');
    let totalPrice = 0;
    order.products.forEach(prod => {
      totalPrice += totalPrice + prod.quantity * prod.product.price;
      pdfDoc.fontSize(14).text(prod.product.title + ' - ' + prod.quantity + ' * ' + '$' + prod.product.price);
    })
    pdfDoc.text('-----');
    pdfDoc.fontSize(20).text('Total Price: $' + totalPrice);

    pdfDoc.end();

    // fs.readFile(invoicePath, (err, data) => {
    //   if (err) {
    //     return next();
    //   }
    //   res.setHeader('Content-Type', 'application/pdf');
    //   res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
    //   res.send(data);
    // })
    // const file = fs.createReadStream(invoicePath);
    // res.setHeader('Content-Type', 'application/pdf');
    // res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
    // file.pipe(res)
  })
  .catch(err=> next(err))
}