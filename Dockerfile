# Specify the base image for the build stage with Node.js v18.9.0
FROM node:18.9.0 AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Install all dependencies, including 'devDependencies' for building
RUN npm install

# Copy prisma schema for Prisma Client generation
COPY prisma ./prisma/

# Install Prisma CLI as devDependency for the build process
RUN npx prisma generate

# Copy the TypeScript configuration
COPY tsconfig.json ./

# Copy the source code
COPY src ./src

# Compile TypeScript to JavaScript
RUN npm run build

# Start a new stage for the production image
FROM node:18.9.0

# Set the working directory in the container
WORKDIR /app

# Copy the generated Prisma client and schema
COPY --from=builder /app/prisma ./prisma/
COPY --from=builder /app/node_modules ./node_modules

# Copy the generated JavaScript files
COPY --from=builder /app/src ./src

# Copy the entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose the port the app runs on
EXPOSE 3002

# Define the command to start the app using the compiled JavaScript
ENTRYPOINT ["/entrypoint.sh"]
