const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoStore = require('connect-mongo');


const { router: authRoutes, authenticateToken } = require('./routes/auth');
const capsuleRoutes = require('./routes/capsules');

const app = express();

const corsOptions = {
  origin: ["http://localhost:4200", "https://time-capsule-orpin.vercel.app"],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // Ensure "public" folder exists and has a favicon.ico

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/api/capsules', capsuleRoutes);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Server is running...');
});

// Serve Angular app
app.use(express.static(path.join(__dirname, 'dist', 'time-capsule')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'time-capsule', 'index.html'));
});

const PORT = process.env.PORT || 2004;

mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});
