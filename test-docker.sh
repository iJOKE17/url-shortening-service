#!/bin/bash

# Script to test the URL Shortening Service with Docker Compose

echo "=== URL Shortening Service Test Script ==="
echo ""
echo "This script demonstrates how to use the Docker Compose setup."
echo ""
echo "Step 1: Build and start the containers"
echo "  $ docker compose up --build -d"
echo ""
echo "Step 2: Wait for services to be healthy (may take 30-60 seconds)"
echo "  $ docker compose ps"
echo ""
echo "Step 3: Test the health endpoint"
echo "  $ curl http://localhost:3000/health"
echo ""
echo "Step 4: Create a short URL"
echo '  $ curl -X POST http://localhost:3000/shorten \'
echo '    -H "Content-Type: application/json" \'
echo '    -d '"'"'{"url": "https://www.example.com"}'"'"
echo ""
echo "Step 5: Access the short URL (replace {shortCode} with actual code)"
echo "  $ curl -L http://localhost:3000/{shortCode}"
echo ""
echo "Step 6: Get URL statistics"
echo "  $ curl http://localhost:3000/stats/{shortCode}"
echo ""
echo "Step 7: Stop the containers"
echo "  $ docker compose down"
echo ""
echo "To remove volumes as well:"
echo "  $ docker compose down -v"
