# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# The API key will be set by Cloud Run's --set-build-env-vars flag
# Cloud Run sets it as an ENV variable during build
# Accept it as ARG first, then set as ENV for Vite to pick up
ARG VITE_GEMINI_API_KEY
ENV VITE_GEMINI_API_KEY=${VITE_GEMINI_API_KEY}

# Verify the key is set (for debugging)
RUN echo "Building with API key: ${VITE_GEMINI_API_KEY:0:20}..."

# Build the app with the API key baked in
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Cloud Run uses PORT environment variable
ENV PORT=8080
EXPOSE 8080

# Start the app using the PORT environment variable
CMD serve -s dist -l $PORT
