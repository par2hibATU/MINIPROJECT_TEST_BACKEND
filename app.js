const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// SESSION SETUP
app.use(session({
  secret: 'my secret', // Replace with secure secret in production
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: 'mongodb://127.0.0.1:27017/db',
    collectionName: 'sessions'
  })
}));

// ROUTES
const mainRoutes = require('./routes/index'); // <- Correct route file
app.use('/', mainRoutes.routes); // match to your existing route exports

// CONNECT TO DB AND START SERVER
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/db')
  .then(() => {
    console.log('MongoDB connected.');
    app.listen(3010, () => {
      console.log('Server running on 3010');
    });
  })
  .catch(err => {
    console.log('Mongoose connection error: ' + err);
  });
