# URL Shortening Service

A robust URL Shortener API built with Express.js and MySQL, containerized with Docker Compose. This service helps you shorten long URLs and track their usage statistics.

## Features

- 🔗 Shorten long URLs with unique short codes
- 📊 Track click statistics for shortened URLs
- 🚀 RESTful API design
- 🐳 Dockerized with Docker Compose
- 🗄️ MySQL database for persistent storage
- 🔄 Automatic URL duplicate detection
- ⚡ Fast redirects with click tracking

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL 8.0
- **Containerization**: Docker, Docker Compose
- **Dependencies**: mysql2, cors, dotenv, shortid, valid-url

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Git (to clone the repository)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/iJOKE17/url-shortening-service.git
   cd url-shortening-service
   ```

2. **Start the application with Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **The API will be available at**: `http://localhost:3000`

### Development Setup (without Docker)

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up MySQL database**
   - Install MySQL locally
   - Create database `urlshortener`
   - Run the SQL script from `init.sql`

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## API Endpoints

### Base URL: `http://localhost:3000`

#### 1. Shorten URL
**POST** `/shorten`

```json
{
  "url": "https://example.com/very-long-url"
}
```

**Response (201 Created):**
```json
{
  "url": "https://example.com/very-long-url",
  "shortUrl": "http://localhost:3000/abc123",
  "shortCode": "abc123",
  "createdAt": "2025-01-08T12:00:00.000Z",
  "updatedAt": "2025-01-08T12:00:00.000Z"
}
```

**Response for existing URL:**

```json
{
  "original_url": "https://example.com/very-long-url",
  "short_url": "http://localhost:3000/abc123",
  "short_code": "abc123",
  "message": "URL already exists"
}
```

#### 2. Retrieve Original URL

**GET** `/shorten/:shortCode`

**Response (200 OK):**

```json
{
  "url": "https://example.com/very-long-url",
  "shortCode": "abc123",
  "createdAt": "2025-01-08T12:00:00.000Z",
  "updatedAt": "2025-01-08T12:00:00.000Z"
}
```

#### 3. Update Short URL

**PUT** `/shorten/:shortCode`

```json
{
  "url": "https://example.com/updated-long-url"
}
```

**Response (200 OK):**

```json
{
  "url": "https://example.com/updated-long-url",
  "shortUrl": "http://localhost:3000/abc123",
  "shortCode": "abc123"
}
```

#### 4. Delete Short URL

**DELETE** `/shorten/:shortCode`

**Response (204 No Content):** Empty response body

#### 5. Get URL Statistics

**GET** `/shorten/:shortCode/stats`

**Response (200 OK):**

```json
{
  "url": "https://example.com/very-long-url",
  "shortUrl": "http://localhost:3000/abc123",
  "shortCode": "abc123",
  "accessCount": 15,
  "createdAt": "2025-01-08T12:00:00.000Z",
  "updatedAt": "2025-01-08T12:00:00.000Z"
}
```

#### 6. Redirect to Original URL

**GET** `/:shortCode`

Redirects (302) to the original URL and increments click count.

#### 7. Health Check

**GET** `/health`

**Response:**

```json
{
  "status": "OK",
  "message": "URL Shortener API is running"
}
```

## Testing the API

### Using curl

1. **Shorten a URL**

   ```bash
   curl -X POST http://localhost:3000/shorten \
     -H "Content-Type: application/json" \
     -d '{"url": "https://www.example.com/very-long-url-that-needs-shortening"}'
   ```

2. **Retrieve original URL**

   ```bash
   curl http://localhost:3000/shorten/YOUR_SHORT_CODE
   ```

3. **Update a short URL**

   ```bash
   curl -X PUT http://localhost:3000/shorten/YOUR_SHORT_CODE \
     -H "Content-Type: application/json" \
     -d '{"url": "https://www.example.com/updated-url"}'
   ```

4. **Delete a short URL**

   ```bash
   curl -X DELETE http://localhost:3000/shorten/YOUR_SHORT_CODE
   ```

5. **Get URL statistics**

   ```bash
   curl http://localhost:3000/shorten/YOUR_SHORT_CODE/stats
   ```

6. **Test redirect (will increment click count)**

   ```bash
   curl -L http://localhost:3000/YOUR_SHORT_CODE
   ```

7. **Health check**

   ```bash
   curl http://localhost:3000/health
   ```

### Complete Testing Workflow

Here's a complete workflow to test all API functionality:

```bash
# 1. First, check if the service is running
curl http://localhost:3000/health

# 2. Create a short URL
RESPONSE=$(curl -s -X POST http://localhost:3000/shorten \
  -H "Content-Type: application/json" \
  -d '{"url": "https://github.com/iJOKE17/url-shortening-service"}')

echo "Created: $RESPONSE"

# 3. Extract the short code from the response (replace 'abc123' with actual code)
SHORT_CODE="abc123"  # Replace with actual short code from step 2

# 4. Retrieve the original URL
curl http://localhost:3000/shorten/$SHORT_CODE

# 5. Get statistics (should show 0 clicks initially)
curl http://localhost:3000/shorten/$SHORT_CODE/stats

# 6. Test redirect (this will increment the click count)
curl -L http://localhost:3000/$SHORT_CODE

# 7. Check statistics again (should show 1 click now)
curl http://localhost:3000/shorten/$SHORT_CODE/stats

# 8. Update the URL
curl -X PUT http://localhost:3000/shorten/$SHORT_CODE \
  -H "Content-Type: application/json" \
  -d '{"url": "https://github.com/iJOKE17/url-shortening-service/blob/main/README.md"}'

# 9. Verify the update
curl http://localhost:3000/shorten/$SHORT_CODE

# 10. Finally, delete the URL
curl -X DELETE http://localhost:3000/shorten/$SHORT_CODE

# 11. Try to access it again (should return 404)
curl http://localhost:3000/shorten/$SHORT_CODE
```

### Using a REST client (Postman, Insomnia, etc.)

Import the following requests:

- **POST** `http://localhost:3000/shorten` with JSON body
- **GET** `http://localhost:3000/shorten/{shortCode}` (retrieve original URL)
- **PUT** `http://localhost:3000/shorten/{shortCode}` with JSON body (update URL)
- **DELETE** `http://localhost:3000/shorten/{shortCode}` (delete URL)
- **GET** `http://localhost:3000/shorten/{shortCode}/stats` (get statistics)
- **GET** `http://localhost:3000/{shortCode}` (for redirect)

## Database Schema

```sql
CREATE TABLE urls (
  id INT AUTO_INCREMENT PRIMARY KEY,
  original_url VARCHAR(2048) NOT NULL,
  short_code VARCHAR(10) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  clicks INT DEFAULT 0,
  INDEX idx_short_code (short_code),
  INDEX idx_created_at (created_at)
);
```

## Docker Services

- **app**: Express.js application (Port 3000)
- **mysql**: MySQL 8.0 database (Port 3306)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 3306 |
| `DB_NAME` | Database name | urlshortener |
| `DB_USER` | Database user | appuser |
| `DB_PASSWORD` | Database password | apppassword |
| `PORT` | Application port | 3000 |
| `BASE_URL` | Base URL for short links | http://localhost:3000 |

## Project Structure

```
url-shortening-service/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   └── urlController.js     # URL handling logic
├── model/
│   └── url.js              # URL data model and database queries
├── routes/
│   └── urls.js             # API routes
├── .dockerignore           # Docker ignore file
├── .env                    # Environment variables
├── .gitignore             # Git ignore file
├── docker-compose.yml     # Docker Compose configuration
├── Dockerfile             # Docker image configuration
├── init.sql              # Database initialization
├── package.json          # Node.js dependencies
├── README.md            # Project documentation
└── server.js           # Main application file
```

## Development

### Available Scripts

- `npm start`: Start production server
- `npm run dev`: Start development server with nodemon
- `npm test`: Run tests (to be implemented)

### Adding New Features

1. Add new routes in `routes/urls.js`
2. Implement controller logic in `controllers/urlController.js`
3. Update database schema in `init.sql` if needed
4. Update this README with new endpoints

## Troubleshooting

### Common Issues

1. **Database connection failed**
   - Ensure MySQL container is running: `docker-compose ps`
   - Check database credentials in `.env`
   - Wait for database initialization (can take 30-60 seconds)

2. **Port already in use**
   - Change port in `docker-compose.yml`
   - Or stop other services using port 3000

3. **Short code collision**
   - The system automatically generates new codes if collision occurs
   - Very rare with shortid library

### Logs

View application logs:
```bash
docker-compose logs -f app
```

View database logs:
```bash
docker-compose logs -f mysql
```

# Note
This project is inspired by and follows the guidelines from the [URL Shortening Service Roadmap](https://roadmap.sh/projects/url-shortening-service) on roadmap.sh.

For a visual representation of the project structure and flow, you can refer to the following roadmap:
https://roadmap.sh/projects/url-shortening-service