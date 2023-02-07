const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const methodOverride = require('method-override');

// CONFIG IMPORTS
require('dotenv').config();
require('./config/database');
require('./config/passport');

const indexRouter = require('./routes/index');
const moviesRouter = require('./routes/movies');
const reviewsRouter = require('./routes/reviews');
const performersRouter = require('./routes/performers');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride('_method'));

// Auth middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Mount user on all templates
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// Static files
app.use(express.static(path.join(__dirname, 'public')));
const isLoggedIn = require('./config/auth');

app.use('/', indexRouter);

app.use('/movies', moviesRouter);
app.use('/', isLoggedIn, reviewsRouter);
app.use('/', isLoggedIn, performersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
