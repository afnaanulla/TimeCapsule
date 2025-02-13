const express = require('express');
const session = require('express-session');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoStore = require('connect-mongo');
const morgan = require('morgan');


const authRoutes = require('./routes/auth');
const capsuleRoutes = require('./routes/capsules');

dotenv.config();

const app = express();

const corsOptions = {

  origin: ['http://localhost:4200','https://time-capsule-gamma.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(morgan('dev'));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 },
  })
);

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/api/capsules', capsuleRoutes);
app.use('/api', capsuleRoutes);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Server is running...');
});


app.use(express.static(path.join(__dirname, 'dist', 'time-capsule')));


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'time-capsule', 'index.html'));
});
const PORT = process.env.PORT || 2004;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
