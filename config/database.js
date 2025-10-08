const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'appuser',
  password: process.env.DB_PASSWORD || 'apppassword',
  database: process.env.DB_NAME || 'urlshortener',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool;

function connectDB() {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
    console.log('MySQL connection pool created');
  }
  return pool;
}

function getPool() {
  if (!pool) {
    throw new Error('Database not connected. Call connectDB() first.');
  }
  return pool;
}

// Wait for database to be ready (useful for Docker)
async function waitForDatabase(maxRetries = 30, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const connection = await mysql.createConnection({
        host: dbConfig.host,
        port: dbConfig.port,
        user: dbConfig.user,
        password: dbConfig.password,
        database: dbConfig.database
      });
      await connection.ping();
      await connection.end();
      
      // Initialize pool after successful connection
      connectDB();
      return;
    } catch (error) {
      console.log(`Database connection attempt ${i + 1}/${maxRetries} failed. Retrying in ${delay}ms...`);
      if (i === maxRetries - 1) {
        throw new Error('Failed to connect to database after maximum retries');
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

module.exports = {
  connectDB,
  getPool,
  waitForDatabase
};