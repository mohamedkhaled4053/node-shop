const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    edit: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  Product.create({ title, imageUrl, price, description }).then(()=>{
    res.redirect('/admin/products')
  });
};

exports.getProducts = (req, res, next) => {
  Product.findAll().then((products) => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
    });
  });
};

exports.getEditProduct = (req, res, next) => {
  Product.findByPk(req.params.id).then((product) => {
    if (!product) {
      return res.redirect('/products/' + req.params.id);
    }
    res.render('admin/add-product', {
      pageTitle: 'edit Product',
      path: '/admin/edit-product',
      edit: true,
      product,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  let id = req.params.id;
  let { title, imageUrl, description, price } = req.body;
  Product.update({title, imageUrl, description, price},{where: {id}}).then(()=>{
    res.redirect('/admin/products');
  })
};

exports.postDeleteProduct = (req, res) => {
  let id = req.params.id;
  Product.destroy({where:{id}}).then(()=>{
    res.redirect('/admin/products');
  })
};
