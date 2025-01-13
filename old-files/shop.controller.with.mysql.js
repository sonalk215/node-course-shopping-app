const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
  .then(([rows, fieldData]) => {
    res.render('shop/product-list', {
      pageTitle: 'All Products',
      path: '/products',
      prods: rows,
    });

  })
  .catch(err=> console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
  .then(([product, fieldData]) => {
    res.render('shop/product-detail', {
      product: product[0],
      pageTitle: product[0].title,
      path: '/products',
    });
  })
  .catch(err=>console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
  .then(([rows, fieldData]) => {
    console.log(rows);
    res.render('shop/index', {
      pageTitle: 'Shop',
      path: '/',
      prods: rows,
    });

  })
  .catch(err=> console.log(err));
};

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts=[];
      for (product of products) {
        const cartProductData = cart.products.find(prod=>prod.id===product.id)
        if(cartProductData) {
          cartProducts.push({productData: product, qty: cartProductData.qty});
        }
      }
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts,
      });
    })
  })
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price)
  })
  console.log(prodId);
  res.redirect('/cart');
}

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/cart');
  })
}

exports.getOrders = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
    });
  });
};

exports.getCheckout = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/checkout', {
      path: '/checkout',
      pageTitle: 'Checkout',
    });
  });
};