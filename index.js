const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;
const webRoutes = require('./routes/index.js');

const corsOptions = {
  credentials: true,
  origin: 'http://localhost:5173', // akses IP address cors policy untuk port frontend
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use('/', webRoutes);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Middleware penanganan rute yang tidak ditemukan (404)
app.use((req, res, next) => {
  res.status(404).json('API Not Found');
});

// Middleware penanganan kesalahan umum
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json(err.message);
});

app.listen(port, () => { console.log(`Server runing port ${port}`) });