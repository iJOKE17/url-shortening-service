const shortid = require("shortid");
const validUrl = require("valid-url");
const UrlModel = require("../model/url");

const baseUrl = process.env.BASE_URL || "http://localhost:3000";

// Shorten URL
const shortenUrl = async (req, res) => {
  try {
    const { url } = req.body;

    // Validate URL
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    if (!validUrl.isUri(url)) {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    // Check if URL already exists
    const existingUrl = await UrlModel.getByOriginalUrl(url);

    if (existingUrl) {
      const shortUrl = `${baseUrl}/api/${existingUrl.short_code}`;
      return res.json({
        original_url: url,
        short_url: shortUrl,
        short_code: existingUrl.short_code,
        message: "URL already exists",
      });
    }

    // Generate unique short code
    let shortCode;
    let isUnique = false;

    while (!isUnique) {
      shortCode = shortid.generate();
      isUnique = !(await UrlModel.checkShortCodeExists(shortCode));
    }

    // Insert new URL
    await UrlModel.insertUrl(url, shortCode);

    const shortUrl = `${baseUrl}/api/${shortCode}`;

    res.status(201).json({
      url: url,
      shortUrl: shortUrl,
      shortCode: shortCode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in shortenUrl:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Redirect to original URL
const redirectUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await UrlModel.getByShortCode(shortCode);

    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    // Increment click count
    await UrlModel.incrementClicks(shortCode);

    // Redirect to original URL
    res.redirect(url.original_url);
  } catch (error) {
    console.error("Error in redirectUrl:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get URL statistics
const getUrlStats = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await UrlModel.getUrlStats(shortCode);

    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    res.json({
      url: url.original_url,
      shortUrl: `${baseUrl}/api/${url.short_code}`,
      shortCode: url.short_code,
      accessCount: url.clicks,
      createdAt: url.created_at,
      updatedAt: url.updated_at,
    });
  } catch (error) {
    console.error("Error in getUrlStats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Retrieve Original URL
const retrieveUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await UrlModel.getByShortCode(shortCode);

    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    return res.json({
      url: url.original_url,
      shortCode: url.short_code,
      createdAt: url.created_at,
      updatedAt: url.updated_at,
    });
  } catch (error) {
    console.error("Error in retrieveUrl:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update Short URL
const updateUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const { url } = req.body;

    if (!url || !validUrl.isUri(url)) {
      return res.status(400).json({ error: "A valid url is required" });
    }

    // Check if URL exists
    const existingUrl = await UrlModel.getByShortCode(shortCode);

    if (!existingUrl) {
      return res.status(404).json({ error: "URL not found" });
    }

    // Update the URL
    const updated = await UrlModel.updateUrl(shortCode, url);

    if (!updated) {
      return res.status(500).json({ error: "Failed to update URL" });
    }

    // Get updated URL data
    const updatedUrl = await UrlModel.getByShortCode(shortCode);

    return res.json({
      url: updatedUrl.original_url,
      shortUrl: `${baseUrl}/api/${updatedUrl.short_code}`,
      shortCode: updatedUrl.short_code,
    });
  } catch (error) {
    console.error("Error in updateUrl:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete Short URL
const deleteUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    // Check if URL exists
    const existingUrl = await UrlModel.getByShortCode(shortCode);

    if (!existingUrl) {
      return res.status(404).json({ error: "URL not found" });
    }

    // Delete the URL
    const deleted = await UrlModel.deleteUrl(shortCode);

    if (!deleted) {
      return res.status(500).json({ error: "Failed to delete URL" });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Error in deleteUrl:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  shortenUrl,
  redirectUrl,
  getUrlStats,
  retrieveUrl,
  updateUrl,
  deleteUrl,
};
