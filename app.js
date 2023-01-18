const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

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


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store,
  })
);

app.use((req, res, next) => {
  User.findById('63c582f725b4b033fc93ef8a')
    .then((user) => {
      req.user = user
      next();
    })
    .catch((err) => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(mongodbUri)
  .then(() => app.listen(3000))
  .catch((err) => console.log(err));
