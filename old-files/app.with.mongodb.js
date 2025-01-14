const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const { mongoConnect } = require('./util/database');
const User = require('./models/user');
const app = express();  //valid request handler

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public")));

//stored user in req object, and user is a Sequelized object
app.use((req, res, next) => {
  User.findById("6653da41e46f3e6bfb1f46bd")
  .then(user=>{
    req.user = new User(user.name, user.email, user.cart, user._id);
    next();
  })
  .catch(err=>console.log(err))
  // next();
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(()=> {
  app.listen(3000)
})