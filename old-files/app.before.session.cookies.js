const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = 'mongodb+srv://rebelthyworld:a5a44k6QPmTxd6h6@cluster0.mq49lnp.mongodb.net/shopDb?retryWrites=true&w=majority&appName=Cluster0';
const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
})

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
)

//stored user in req object, and user is a Sequelized object
app.use((req, res, next) => {
  User.findById("665583ae275021d79dc8c9f9")
  .then(user=>{
    req.user = user;
    next();
  })
  .catch(err=>console.log(err))
  // next();
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);


mongoose.connect(MONGODB_URI)
.then(result => {
  User.findOne()
  .then(user=>{
    if(!user) {
      const user = new User({
        name: 'Test1',
        email: 'test1@test1.com',
        cart: {
          items: []
        }
      });
      user.save()
    }
  })  
  console.log('MONGOOSE CONNECTED');
  app.listen(3000)
})
.catch(err=>console.log(err))