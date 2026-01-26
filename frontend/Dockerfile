# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files including lock files
# Note: package*.json will copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies
# Use npm ci if package-lock.json exists (faster and more reliable for production builds)
# Otherwise fall back to npm install (for development or when lock file is not present)
# Note: npm ci requires a package-lock.json or npm-shrinkwrap.json file
RUN set -e; \
    if [ -f package-lock.json ] || [ -f npm-shrinkwrap.json ]; then \
      echo "Lock file found, using npm ci for clean install..."; \
      npm ci; \
    else \
      echo "No lock file found, using npm install..."; \
      npm install; \
    fi

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
