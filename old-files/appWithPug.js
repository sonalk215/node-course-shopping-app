//node packages
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');
//own files
const adminData = require('../routes/admin');
const shopRoutes = require('../routes/shop');
// 3rd party packages
const express = require('express');

const app = express();  //valid request handler
app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public")));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
  // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
  res.status(404).render('404', {pageTitle: 'Page Not Found'});
  // res.status(404).send('<h1>Page not found</h1>')
})
//NODE way for server listen
// const server = http.createServer(app);

// server.listen(3000);

//express way to server listen
app.listen(3000);