var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var settings = require('./server-src/settings');
const customAuthMiddleware = require('./server-src/middleware/custom-auth-middleware');
const customAuthMiddlewareWS = require('./server-src/middleware/custom-auth-middleware-ws');
const customDocMiddleware = require('./server-src/middleware/custom-doc-middleware');
const customDocMiddlewareWS = require('./server-src/middleware/custom-doc-middleware-ws');
const customPluginMiddleware = require('./server-src/middleware/custom-plugin_loaded-middleware');
const customPluginMiddlewareWS = require('./server-src/middleware/custom-plugin_loaded-middleware-ws');
const socketRouter = require('./server-src/routes/ws');
var indexRouter = require('./server-src/routes/index');


var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server, {
  pingTimeout: 60000,
});

// view engine setup
app.set('views', path.join(__dirname, 'server-src/views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  if(!req.locals){
		req.locals = {}
  }
  if(!res.locals.plugin){
    res.locals.plugin = {}
		res.locals.plugin.html = []
		res.locals.plugin.js = []
		res.locals.plugin.css = []
	}
  res.locals.settings = {
    whitelisted : [
      '/',
      '/login',
      '/register',
      'logout'
    ]
  };
  res.locals.appSettings = settings.appSettings
  next();
});

app.use(customAuthMiddleware);
app.use(customDocMiddleware);
app.use(customPluginMiddleware);
customPluginMiddleware

app.use(function(req, res, next){
  res.io = io;
  next();
});

app.use('/', indexRouter);

// add context to pug
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = settings.development.debug ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

if (settings.appSettings.ws){
  io.use((socket, next) => {
    socket.locals = {};
    socket.locals.appSettings = settings.appSettings;
    socket.locals.settings = {
      with_ws: true,
      whitelisted:[
        "getHome",
        "getLogin",
        "getNavbar",
        "getRegister",
        "postRegister",
        "postLogin",
        "logout"
      ]
    };
    next();
  });
  io.use(async (socket, next) => {
    await customPluginMiddlewareWS(socket, next)
  })
  
  io.on('connection', function(socket) {
    socket.use(async (packet, next) => {
      await customAuthMiddlewareWS(socket, packet, next)
    });
    socket.use(async (packet, next) => {
      await customDocMiddlewareWS(socket, packet, next)
    });
    socketRouter(socket, app, io)
  })
}


module.exports = {app: app, server: server};
