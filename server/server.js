const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const logger = require('./utils/logger');

dotenv.config();

const app = express();

// Trust proxy for Render/PaaS environments
app.set('trust proxy', 1);

// Security Middlewares
app.use(helmet());
app.use(express.json({ limit: '10kb' })); // Body limit to prevent DoS
app.use(cors());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Connect Database
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/companies', require('./routes/companies'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/support', require('./routes/support'));
app.use('/api/upgrade', require('./routes/upgrade'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/social', require('./routes/social'));

// Serve Static Assets in Production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  // Set static folder
  app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'client', 'dist', 'index.html'));
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  logger.error(`${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  logger.info(`Trust Proxy: ${app.get('trust proxy')}`);
});
