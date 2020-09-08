const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '/../public');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString, beautifyCredentials} = require('./utils/validation');
const {Users} = require('./utils/users');
var app = express();
var server = http.createServer((app));
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New User Connected');

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Username and Room name are required');
    }

    params.room = params.room.toLowerCase();

    if (!users.isUniqueUserName(params.name, params.room)) {
      return callback('Username already exist.')
    }

    socket.join(params.room);

    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    if (users.getRoomList().filter((room) => room === params.room).length === 1) {
      console.log('Adding room to the list');
      io.emit('updateRoomList', users.getRoomList());
    }

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the Chat App'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} Joined`));

    callback();
  });

  socket.on('createMessage', (message, callback) => {
    var user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text, socket.id));
      callback();
    }
  });

  socket.on('createLocationMessage', (coords) => {
    var user = users.getUser(socket.id);

    if (user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude, socket.id));
    }
  });

  socket.on('loginConnected', () => {
    io.emit('updateRoomList', users.getUniqueRoomList());
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
    var user = users.removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
      if (users.getUserList(user.room).length === 0) {
        io.emit('updateRoomList', users.getUniqueRoomList());
        console.log('Removing room from the list');
      }
    }
  });
});

server.listen(port, () => {
  console.log(`server running on port ${port}`);
});
