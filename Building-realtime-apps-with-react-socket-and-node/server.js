var path = require('path');
var fs = require('fs');
var express = require('express');

// Server part
var app = express();
app.use('/', express.static(path.join(__dirname, 'views')));

var server = app.listen(8080);
console.log('Server listening on port 8080');

// Socket.IO part
var io = require('socket.io')(server);

// socket.io demo
io.on('connection', function (socket) {
  socket.emit('server event', { foo: 'bar' });
  socket.on('client event', function (data) {
    socket.broadcast.emit('update label', data);
  });
});