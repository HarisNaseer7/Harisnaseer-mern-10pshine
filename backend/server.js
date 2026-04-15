const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const requestLogger = require('./middleware/loggerMiddleware');
const errorHandler = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/auth');

dotenv.config();
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Request logger
app.use(requestLogger);

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  const logger = require('./utils/logger');
  logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});