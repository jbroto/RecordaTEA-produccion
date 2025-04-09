var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var mysqlSession = require("express-mysql-session");

var usuariosRouter = require('./routes/usuariosRouter');
var cuidadoresRouter = require('./routes/cuidadoresRouter');
var tarjetasRouter = require('./routes/tarjetasRouter');
var rutinasRouter = require('./routes/rutinasRouter');
var entradasRouter = require('./routes/entradasRouter');

const MySQLStore = mysqlSession(session);
const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
  resave: false,
  store: sessionStore
}));

app.get('/', (req, res) => {
  if (!req.session.logged) { res.sendFile(path.join(__dirname, 'public', 'views', 'registro.html')); }
  else {
    if (req.session.cuidador) { res.redirect('/cuidadores/inicio'); }
    else res.redirect('/users');
  }

});

app.use('/cuidadores', cuidadoresRouter);
app.use('/tarjetas-comunicacion', tarjetasRouter);
app.use('/users', usuariosRouter);
app.use('/rutinas', rutinasRouter);
app.use('/diario', entradasRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.sendFile(path.join(__dirname, 'public', 'views', 'error404.html'));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {err: err});
});

module.exports = app;
