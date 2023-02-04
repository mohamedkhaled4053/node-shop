const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

const errorController = require('./controllers/error');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const { User } = require('./models/user');

let mongodbUri =
  'mongodb+srv://mongouser:mongo@cluster0.tmobxrw.mongodb.net/shop?retryWrites=true&w=majority';

let store = new MongoDBStore({
  uri: mongodbUri,
  collection: 'sessions',
});
let csrfProtection = csrf();
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,'images')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  },
});

let fileFilter = (req,file,cb)=>{
  if (file.mimetype ==='image/png' || file.mimetype ==='image/jpg' || file.mimetype ==='image/jpeg' ) {
    cb(null,true)
  } else{
    cb(null,false)
  }
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({  storage:fileStorage , fileFilter}).single('image'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store,
  })
);
app.use(flash());
app.use(csrfProtection);
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if(!user){
        return next()
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      throw new Error(err)
    });
});

app.use((req, res, next) => {
  res.locals = {
    csrfToken: req.csrfToken(),
    isLoggedIn: req.session.isLoggedIn,
  };
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use('/500',errorController.get500);
app.use(errorController.get404);
app.use((error, req,res,next)=>{
  res.redirect('/500')
});

mongoose
  .connect(mongodbUri)
  .then(() => app.listen(3000))
  .catch((err) => console.log(err));
