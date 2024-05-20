const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/auth');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/sample', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes
app.use('/auth', authRoutes);

// Home route
app.get('/', (req, res) => {
  res.render('index');
});

// Dashboard route
app.get('/dashboard', authMiddleware, (req, res) => {
  res.render('dashboard');
});

// Logout route
app.get('/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

