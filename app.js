const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars')

const app = express();
app.engine('hbs',handlebars())
app.set('view engine','hbs')

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
    // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
    res.status(404).render('404',{title: 404})
});

app.listen(3000);
