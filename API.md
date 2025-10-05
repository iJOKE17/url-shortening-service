# API Quick Reference

## Base URL
```
http://localhost:3000
```

## Endpoints

### 1. Health Check
**GET** `/health`

Check if the service is running.

**Response:**
```json
{
  "status": "ok",
  "message": "URL Shortening Service is running"
}
```

### 2. Create Short URL
**POST** `/shorten`

Create a shortened URL.

**Request Body:**
```json
{
  "url": "https://www.example.com/very/long/url"
}
```

**Response:**
```json
{
  "shortCode": "abc1234",
  "shortUrl": "http://localhost:3000/abc1234",
  "originalUrl": "https://www.example.com/very/long/url"
}
```

**Status Codes:**
- `201 Created` - Short URL created successfully
- `400 Bad Request` - Invalid URL or missing URL parameter
- `500 Internal Server Error` - Server error

### 3. Redirect to Original URL
**GET** `/:shortCode`

Redirects to the original URL.

**Parameters:**
- `shortCode` - The short code for the URL

**Response:**
- `302 Found` - Redirects to the original URL
- `404 Not Found` - Short URL not found
- `500 Internal Server Error` - Server error

### 4. Get URL Statistics
**GET** `/stats/:shortCode`

Get statistics for a shortened URL.

**Parameters:**
- `shortCode` - The short code for the URL

**Response:**
```json
{
  "shortCode": "abc1234",
  "originalUrl": "https://www.example.com/very/long/url",
  "accessCount": 5,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "lastAccessed": "2024-01-01T12:00:00.000Z"
}
```

**Status Codes:**
- `200 OK` - Statistics retrieved successfully
- `404 Not Found` - Short URL not found
- `500 Internal Server Error` - Server error

## Example Usage with curl

### Create a short URL:
```bash
curl -X POST http://localhost:3000/shorten \
  -H "Content-Type: application/json" \
  -d '{"url": "https://github.com/iJOKE17/url-shortening-service"}'
```

### Access a short URL:
```bash
curl -L http://localhost:3000/abc1234
```

### Get statistics:
```bash
curl http://localhost:3000/stats/abc1234
```
