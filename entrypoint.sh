#!/bin/sh
# Check and apply database migrations
echo "Running Prisma migrations..."
npx prisma migrate deploy

# Start the application
echo "Starting the application..."
exec node dist/index.js

