# url-shortening-service
Build a URL Shortener API that helps shorten long URLs.

## Features

- Create shortened URLs
- Redirect to original URLs
- Track URL access statistics
- Built with Express.js and MySQL
- Containerized with Docker Compose

## Prerequisites

- Docker
- Docker Compose

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/iJOKE17/url-shortening-service.git
cd url-shortening-service
```

### 2. Build and run with Docker Compose

```bash
docker-compose up --build
```

This will start two containers:
- MySQL database on port 3306
- Express.js application on port 3000

### 3. Test the API

Once the containers are running, you can test the API:

**Health Check:**
```bash
curl http://localhost:3000/health
```

**Create a short URL:**
```bash
curl -X POST http://localhost:3000/shorten \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.example.com/very/long/url"}'
```

**Access a short URL:**
```bash
curl -L http://localhost:3000/{shortCode}
```

**Get URL statistics:**
```bash
curl http://localhost:3000/stats/{shortCode}
```

## API Endpoints

### POST /shorten
Create a shortened URL.

**Request Body:**
```json
{
  "url": "https://www.example.com"
}
```

**Response:**
```json
{
  "shortCode": "abc1234",
  "shortUrl": "http://localhost:3000/abc1234",
  "originalUrl": "https://www.example.com"
}
```

### GET /:shortCode
Redirect to the original URL.

### GET /stats/:shortCode
Get statistics for a shortened URL.

**Response:**
```json
{
  "shortCode": "abc1234",
  "originalUrl": "https://www.example.com",
  "accessCount": 5,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "lastAccessed": "2024-01-01T12:00:00.000Z"
}
```

### GET /health
Health check endpoint.

## Project Structure

```
url-shortening-service/
├── server.js           # Express.js application
├── db.js              # MySQL database configuration
├── init.sql           # Database initialization script
├── package.json       # Node.js dependencies
├── Dockerfile         # Docker image configuration
├── docker-compose.yml # Docker Compose configuration
├── .env.example       # Environment variables template
└── README.md          # Project documentation
```

## Environment Variables

See `.env.example` for available environment variables:

- `PORT`: Application port (default: 3000)
- `DB_HOST`: MySQL host (default: mysql)
- `DB_USER`: MySQL user (default: root)
- `DB_PASSWORD`: MySQL password
- `DB_NAME`: MySQL database name (default: url_shortener)
- `DB_PORT`: MySQL port (default: 3306)

## Stopping the Application

```bash
docker-compose down
```

To remove volumes as well:
```bash
docker-compose down -v
```

## Development

To run in development mode with hot reload:

1. Install dependencies locally:
```bash
npm install
```

2. Start MySQL using Docker Compose:
```bash
docker-compose up mysql
```

3. Create a `.env` file based on `.env.example` and update `DB_HOST` to `localhost`

4. Run the application:
```bash
npm run dev
```
