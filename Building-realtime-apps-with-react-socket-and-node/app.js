var app = require('express')();
var server = require('http').Server(app);
var swig = require('swig');
var path = require('path');
var io = require('socket.io')(server);

// view engine setup
app.engine('html', swig.renderFile);
app.set('view engine', 'html');

// socket.io demo
io.on('connection', function (socket) {
  socket.emit('server event', { foo: 'bar' });
  socket.on('client event', function (data) {
    socket.broadcast.emit('update label', data);
  });
});

// server and routing
server.listen(8080);
app.get('/', function (req, res) {
  res.render('index');
});
