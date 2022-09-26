const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const passport = require('passport');
const session = require('express-session');
const GithubStrategy = require('passport-github').Strategy;

const passportConfig = require('./config.js');

const indexRouter = require('./routes/index');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'img-src': ['*'],
      'script-src': ['*']
    },
  })
);

app.use(session({
  secret: 'Movie App to Learn Passport',
  resave: false,
  saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GithubStrategy(passportConfig, (accessToken, refreshToken, profile, cb) => cb(null, profile)));
passport.serializeUser((user, done) => { done(null, user); });
passport.deserializeUser((user, done) => { done(null, user); });

app.use('/', indexRouter);

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
