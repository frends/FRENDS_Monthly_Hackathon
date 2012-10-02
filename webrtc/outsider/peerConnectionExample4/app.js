
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , ws = require('websocket.io');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

var httpServer = http.createServer(app)
httpServer.listen(app.get('port'), function(){
  console.log("Express server listening on portr " + app.get('port'));
});

// webSocket
var server = ws.attach(httpServer);
var clients = [];

server.on('connection', function(socket) {
  console.log('client is connected');
  clients.push(socket);

  socket.on('message', function(msg) {
    clients.forEach(function(elem) {
      if (socket != elem) {
        elem.send(msg);
      }
    })
  });
});
