#!/bin/bash

# Load environment variables from .env
if [ ! -f .env ]; then
    echo "ERROR: .env file not found!"
    echo "Please create .env with your VITE_GEMINI_API_KEY"
    exit 1
fi

# Source .env file
export $(cat .env | grep -v '^#' | xargs)

# Check if API key is set
if [ -z "$VITE_GEMINI_API_KEY" ] || [ "$VITE_GEMINI_API_KEY" = "REPLACE_WITH_YOUR_NEW_API_KEY_HERE" ]; then
    echo "ERROR: VITE_GEMINI_API_KEY is not set in .env"
    echo "Please update .env with your actual API key"
    exit 1
fi

echo "Deploying to Cloud Run with API key from .env..."
echo "API key: ${VITE_GEMINI_API_KEY:0:20}... (showing first 20 chars)"

gcloud run deploy pixelbooth \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --build-arg VITE_GEMINI_API_KEY="$VITE_GEMINI_API_KEY"

echo "Deployment complete!"
