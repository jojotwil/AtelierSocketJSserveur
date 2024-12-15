var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const http = require('http');
const { Server } = require('socket.io');
const Chat = require('./model/chat'); // Chat model for MongoDB operations

// Connect to Database
var mongoose = require('mongoose');
var mongoConnect = require('./config/database.json');
mongoose.connect(mongoConnect.url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var paysRouter = require('./routes/pays');

var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
const io = new Server(server);

// Route for chat view
app.get('/', (req, res) => {
  res.render('chat'); // Render the chat.twig file
});

// Socket.io logic
io.on('connection', (socket) => {
  console.log('User Connected..');

  let username = '';

  // Set the user's username
  socket.on('set username', (name) => {
    username = name;
    console.log(`Username set: ${username}`);
    socket.emit('msg', `Welcome to the chat, ${username}!`);
    socket.broadcast.emit('msg', `${username} has joined the chat.`);
  });

  // Handle incoming messages and save them to MongoDB
  socket.on('chat message', async (data) => {
    try {
      if (!data.message || typeof data.message !== 'string' || data.message.trim() === '') {
        console.error('Invalid message:', data.message);
        return;
      }

      const chatMessage = new Chat({ username: data.username, message: data.message.trim() });
      await chatMessage.save();
      io.emit('chat message', `${data.username}: ${data.message}`); // Broadcast the message to all clients
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  // Handle typing notifications
  socket.on('typing', (msg) => {
    if (msg) {
      socket.broadcast.emit('typing', msg); // Broadcast the typing message
    } else {
      socket.broadcast.emit('typing', ''); // Clear typing message if no message is being typed
    }
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('User Disconnected');
    if (username) {
      io.emit('msg', `${username} has left the chat.`);
    }
  });
});

// Start the server
server.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});

// Define routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/pays', paysRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
