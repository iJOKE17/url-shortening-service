const express = require('express');
const { customAlphabet } = require('nanoid');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Generate short codes using nanoid with custom alphabet
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 7);

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'URL Shortening Service is running' });
});

// Create short URL
app.post('/shorten', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (err) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Generate unique short code
    const shortCode = nanoid();

    // Insert into database
    const [result] = await db.query(
      'INSERT INTO urls (short_code, original_url) VALUES (?, ?)',
      [shortCode, url]
    );

    res.status(201).json({
      shortCode,
      shortUrl: `http://localhost:${PORT}/${shortCode}`,
      originalUrl: url
    });
  } catch (error) {
    console.error('Error creating short URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Redirect to original URL
app.get('/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;

    const [rows] = await db.query(
      'SELECT original_url FROM urls WHERE short_code = ?',
      [shortCode]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    // Update access count
    await db.query(
      'UPDATE urls SET access_count = access_count + 1, last_accessed = NOW() WHERE short_code = ?',
      [shortCode]
    );

    res.redirect(rows[0].original_url);
  } catch (error) {
    console.error('Error redirecting:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get URL statistics
app.get('/stats/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;

    const [rows] = await db.query(
      'SELECT * FROM urls WHERE short_code = ?',
      [shortCode]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    res.json({
      shortCode: rows[0].short_code,
      originalUrl: rows[0].original_url,
      accessCount: rows[0].access_count,
      createdAt: rows[0].created_at,
      lastAccessed: rows[0].last_accessed
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
