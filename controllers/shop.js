const { Product } = require('../models/product');
const fs = require('fs');
const path = require('path');
const pdfkit = require('pdfkit');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
      });
    })
    .catch((err) => console.log(err));
};
exports.getProduct = (req, res, next) => {
  Product.findById(req.params.id).then((product) => {
    res.render('shop/product-detail.ejs', {
      pageTitle: product ? product.title : 'not found',
      path: '/products',
      product,
    });
  });
};

exports.addToCart = (req, res, next) => {
  req.user.addToCart(req.body.id).then(() => {
    res.redirect('/cart');
  });
};

exports.getIndex = (req, res, next) => {
  Product.find().then((products) => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
    });
  });
};

exports.getCart = (req, res, next) => {
  req.user.getCart().then((cart) => {
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      cart,
    });
  });
};

exports.getOrders = (req, res, next) => {
  req.user.getOrders().then((orders) => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders,
    });
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
  });
};

exports.deleteCartItem = (req, res) => {
  req.user.deleteCartItem(req.body.id).then(() => res.redirect('/cart'));
};

exports.createOrder = (req, res) => {
  req.user.addOrder().then(() => res.redirect('/orders'));
};

exports.getInvoice = async (req, res, next) => {
  let invoiceId = req.params.orderId;
  let invoiceName = `invoice-${invoiceId}.pdf`;
  let invoicePath = path.join('data', 'invoices', invoiceName);
  let invoice = await Order.findById(invoiceId);
  if (!invoice) {
    return next(new Error('this invoice does not exist'));
  }
  if (invoice.user._id.toString() !== req.user._id.toString()) {
    return next(new Error('your not allowed to access this'));
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline;filename="${invoiceName}"`);
  let pdfDoc = new pdfkit();
  pdfDoc.pipe(fs.createWriteStream(invoicePath));
  pdfDoc.pipe(res);

  pdfDoc.fontSize(26).text(`invoice`)
  pdfDoc.fontSize(16).text(`------------------------------------------------------------------------------------`)
  let totalPrice = 0
  invoice.items.forEach(item => {
    totalPrice+= item.amount*item.product.price
    pdfDoc.text(`${item.product.title}     ------     amount: ${item.amount}     ------     price: ${item.amount} * ${item.product.price} = ${item.amount*item.product.price} `)
  })
  pdfDoc.text(`------------------------------------------------------------------------------------`)
  pdfDoc.text(`total price: ${totalPrice}`)
  pdfDoc.end();

  // let file = fs.createReadStream(invoicePath);
  // res.setHeader('Content-Type', 'application/pdf');
  // res.setHeader('Content-Disposition', `inline;filename="${invoiceName}"`);
  // file.pipe(res);

  // fs.readFile(invoicePath,(err,data)=>{
  //   if (err) return next(err)
  //   res.setHeader('Content-Type','application/pdf')
  //   res.setHeader('Content-Disposition',`inline;filename="${invoiceName}"`)
  //   res.send(data)
  // })
};
