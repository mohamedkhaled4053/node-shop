const { Product } = require('../models/product');
const fs = require('fs');
const path = require('path');
const pdfkit = require('pdfkit');
const Order = require('../models/order');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const ITEMS_PER_PAGE = 2;

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

exports.getIndex = async (req, res, next) => {
  let page = +req.query.page || 1;
  let numOfProducts = await Product.find().countDocuments();
  let numOfPages = Math.ceil(numOfProducts / ITEMS_PER_PAGE);
  let products = await Product.find()
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE);
  res.render('shop/index', {
    prods: products,
    pageTitle: 'Shop',
    path: '/',
    numOfPages,
    currentPage: page,
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
  let products;
  let total;
  req.user
    .getCart()
    .then((cart) => {
      products = cart;
      total = cart.reduce((total, p) => total + p.amount * p.product.price, 0);
      return stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode:'payment',
        line_items: products.map((p) => {
          return {
            price_data: {
              currency: 'usd',
              unit_amount: p.product.price * 100,
              product_data: {
                name: p.product.title,
                description: p.product.description,
              },
            },
            quantity: p.amount,
          };
        }),
        success_url:
          req.protocol + '://' + req.get('host') + '/checkout/success',
        cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel',
      });
    })
    .then((session) => {
      res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout',
        products,
        totalSum: total,
        stripePublicKey: process.env.STRIPE_PUBLIC_KEY,
        sessionId: session.id,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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

  pdfDoc.fontSize(26).text(`invoice`);
  pdfDoc
    .fontSize(16)
    .text(
      `------------------------------------------------------------------------------------`
    );
  let totalPrice = 0;
  invoice.items.forEach((item) => {
    totalPrice += item.amount * item.product.price;
    pdfDoc.text(
      `${item.product.title}     ------     amount: ${
        item.amount
      }     ------     price: ${item.amount} * ${item.product.price} = ${
        item.amount * item.product.price
      } `
    );
  });
  pdfDoc.text(
    `------------------------------------------------------------------------------------`
  );
  pdfDoc.text(`total price: ${totalPrice}`);
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
