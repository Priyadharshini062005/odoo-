var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { specs, swaggerUi } = require('./swagger/apiDocs');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/productRoutes');
var authRouter = require('./routes/authRoutes');
var orderRouter = require('./routes/orderRoutes');
var fileRouter = require('./routes/fileRoutes');
var blogRouter = require('./routes/blogRoutes');
var cartRouter = require('./routes/cartRoutes');

/**
 * Setting up database
 */
dotenv.config();
connectDB();

var app = express();

/**
 * Setting up views
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


/**
 * Registering middlewares
 */
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


/**
 * Registering routers
 */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/', indexRouter);
app.use('/api/file', fileRouter)
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', orderRouter);
app.use('/api/blogs', blogRouter);
app.use('/api/cart', cartRouter)


/**
 * Capturing 404 error
 */
app.use(function(req, res, next) {
  next(createError(404));
});


/**
 * Error handling
 */
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
