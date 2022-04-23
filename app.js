var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const methodOverride =require('method-override');
const session = require('express-session');


const cookieCheck = require('./middleware/cookieCheck');/* cookies */
const localsUserCheck = require('./middleware/localsUserCheck');/* usuario admin */

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
const { application } = require('express');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(methodOverride('_method'));
/* este es una ves instalado express-session guardar tu logeada */
app.use(session({
  secret: 'secret',
  resave: false, /* estos 2 son nuevos actualizaciones deben estar resave y sabeunitlized nos puede joder si no estan por las cookies */
  saveUninitialized: true
}))
app.use(cookieCheck)/* cookies */
app.use(localsUserCheck)/* usuario admin */

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
