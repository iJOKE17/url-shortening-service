const { getPool } = require("../config/database");

class UrlModel {
  static async getByShortCode(shortCode) {
    const pool = getPool();
    const [rows] = await pool.execute(
      "SELECT * FROM urls WHERE short_code = ?",
      [shortCode]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  static async getByOriginalUrl(originalUrl) {
    const pool = getPool();
    const [rows] = await pool.execute(
      "SELECT short_code FROM urls WHERE original_url = ?",
      [originalUrl]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  static async insertUrl(originalUrl, shortCode) {
    const pool = getPool();
    const [result] = await pool.execute(
      "INSERT INTO urls (original_url, short_code) VALUES (?, ?)",
      [originalUrl, shortCode]
    );
    return result.insertId;
  }

  static async updateUrl(shortCode, originalUrl) {
    const pool = getPool();
    const [result] = await pool.execute(
      "UPDATE urls SET original_url = ?, updated_at = NOW() WHERE short_code = ?",
      [originalUrl, shortCode]
    );
    return result.affectedRows > 0;
  }

  static async deleteUrl(shortCode) {
    const pool = getPool();
    const [result] = await pool.execute(
      "DELETE FROM urls WHERE short_code = ?",
      [shortCode]
    );
    return result.affectedRows > 0;
  }

  static async incrementClicks(shortCode) {
    const pool = getPool();
    const [result] = await pool.execute(
      "UPDATE urls SET clicks = clicks + 1 WHERE short_code = ?",
      [shortCode]
    );
    return result.affectedRows > 0;
  }

  static async checkShortCodeExists(shortCode) {
    const pool = getPool();
    const [rows] = await pool.execute(
      "SELECT id FROM urls WHERE short_code = ?",
      [shortCode]
    );
    return rows.length > 0;
  }

  static async getUrlStats(shortCode) {
    const pool = getPool();
    const [rows] = await pool.execute(
      "SELECT original_url, short_code, created_at, updated_at, clicks FROM urls WHERE short_code = ?",
      [shortCode]
    );
    return rows.length > 0 ? rows[0] : null;
  }
}

module.exports = UrlModel;
