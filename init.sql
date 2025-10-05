CREATE DATABASE IF NOT EXISTS url_shortener;

USE url_shortener;

CREATE TABLE IF NOT EXISTS urls (
  id INT AUTO_INCREMENT PRIMARY KEY,
  short_code VARCHAR(10) UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  access_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_accessed TIMESTAMP NULL DEFAULT NULL,
  INDEX idx_short_code (short_code)
);
