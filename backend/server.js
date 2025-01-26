const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const bodyParser = require('body-parser');

require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:4200', methods: ['GET', 'POST'] }));
app.use(express.json());
app.use('/auth', authRoutes);
app.use(express.static(path.join(__dirname, 'public')));
//content security policy
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; font-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline';"
  );
  next();
});
// content security policy
app.get('/', (req, res) => {
  res.send('Hello from me');
})
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'favicon.ico'));
});

const PORT = process.env.PORT || 2004;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

app.set(console.log("hello from me"))
