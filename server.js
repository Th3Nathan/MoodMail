var express = require('express');
var passport = require('passport');
var mongoose = require('mongoose');  

mongoose.connect(require('./config/database.js').url);

var db = mongoose.connection;
db.on('error', (err) => {console.log(err)});
db.once('open', function() {
  app.listen(process.env.PORT || 3000, function(){
    console.log("app is listening");
  });
});

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

var routes = require('./config/routes.js');  
app.use('/', routes);
