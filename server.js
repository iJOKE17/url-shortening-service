const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const urlRoutes = require('./routes/urls');
const { waitForDatabase } = require('./config/database');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', urlRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'URL Shortener API is running' });
});

// Root endpoint
app.get('/', (req, res) => {
res.json({
    message: 'Welcome to URL Shortener API',
    endpoints: {
        'POST /shorten': 'Create a shortened URL',
        'GET /shorten/:shortCode': 'Retrieve original URL details',
        'PUT /shorten/:shortCode': 'Update short URL',
        'DELETE /shorten/:shortCode': 'Delete short URL',
        'GET /shorten/:shortCode/stats': 'Get URL statistics',
        'GET /:shortCode': 'Redirect to original URL',
        'GET /health': 'Health check'
    }
});
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server with database connection
async function startServer() {
  try {
    console.log('Waiting for database connection...');
    await waitForDatabase();
    console.log('Database connected successfully');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();