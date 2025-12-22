# PixelBoof Deployment Guide - API Key Update

## Current Status
- ✅ New API key created and added to `.env` file
- ✅ `.env` is gitignored (safe - won't leak to GitHub)
- ✅ All code fixes committed and pushed to main
- ❌ Need to deploy with new API key

## The Problem
Google disabled your old API key because it was leaked in GitHub. We need to deploy with the new key stored in `.env`

## Solution Options

### Option 1: Fix gcloud and Deploy (RECOMMENDED)

The gcloud deployment has ZIP timestamp issues. Here's how to fix:

1. **Start Docker Desktop** (if not running)
   - Make sure Docker Desktop is running before attempting deployment

2. **Build and push Docker image:**
   ```bash
   # Configure Docker for Google Artifact Registry
   gcloud auth configure-docker us-central1-docker.pkg.dev

   # Build the image locally (this avoids ZIP timestamp issues)
   # Get API key from .env file first: set /p VITE_GEMINI_API_KEY=< .env
   docker build --build-arg VITE_GEMINI_API_KEY=%VITE_GEMINI_API_KEY% -t us-central1-docker.pkg.dev/device-streaming-4a95fdb3/cloud-run-source-deploy/pixelbooth:latest .

   # Push to Artifact Registry
   docker push us-central1-docker.pkg.dev/device-streaming-4a95fdb3/cloud-run-source-deploy/pixelbooth:latest

   # Deploy the pre-built image to Cloud Run
   gcloud run deploy pixelbooth \
     --image us-central1-docker.pkg.dev/device-streaming-4a95fdb3/cloud-run-source-deploy/pixelbooth:latest \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

### Option 2: Manual Deployment via Google Cloud Console

1. **Build locally:**
   ```bash
   # Load API key from .env file
   for /f "usebackq tokens=1,* delims==" %%a in (".env") do if "%%a"=="VITE_GEMINI_API_KEY" set "VITE_GEMINI_API_KEY=%%b"

   # Build the app
   npm install
   npm run build
   ```

2. **Upload `dist` folder to Cloud Storage:**
   - Go to: https://console.cloud.google.com/storage
   - Create a bucket or use existing
   - Upload the `dist` folder contents

3. **Deploy to Cloud Run:**
   - Go to: https://console.cloud.google.com/run
   - Click `pixelbooth` service
   - Click "EDIT & DEPLOY NEW REVISION"
   - Update container or use static hosting

### Option 3: Use GitHub Actions (Future deployments)

Set up GitHub Actions to auto-deploy (requires GCP service account setup):

1. **Create GCP Service Account:**
   ```bash
   gcloud iam service-accounts create github-actions \
     --display-name "GitHub Actions"

   gcloud projects add-iam-policy-binding device-streaming-4a95fdb3 \
     --member="serviceAccount:github-actions@device-streaming-4a95fdb3.iam.gserviceaccount.com" \
     --role="roles/run.admin"

   gcloud projects add-iam-policy-binding device-streaming-4a95fdb3 \
     --member="serviceAccount:github-actions@device-streaming-4a95fdb3.iam.gserviceaccount.com" \
     --role="roles/cloudbuild.builds.builder"

   gcloud iam service-accounts keys create key.json \
     --iam-account=github-actions@device-streaming-4a95fdb3.iam.gserviceaccount.com
   ```

2. **Add to GitHub Secrets:**
   - Go to: https://github.com/MavScriptBlu/PixelBoof/settings/secrets/actions
   - Click "New repository secret"
   - Name: `GCP_SA_KEY`
   - Value: Contents of `key.json` file
   - (You already have `VITE_GEMINI_API_KEY` set up ✅)

3. **Push to trigger deployment:**
   ```bash
   git push origin main
   ```
   The GitHub Action in `.github/workflows/deploy-cloud-run.yml` will automatically deploy!

## Quick Reference

### Your Details
- **Project ID:** `device-streaming-4a95fdb3`
- **Service Name:** `pixelbooth`
- **Region:** `us-central1`
- **API Key Location:** `.env` file (NEVER commit this!)
- **Deployed URL:** https://pixelbooth-784690008259.us-central1.run.app/

### Files Created
- `.env` - Contains your API key (NEVER commit this!)
- `deploy.bat` - Windows deployment script
- `deploy.sh` - Linux/Mac deployment script
- `.gcloudignore` - Excludes node_modules from uploads
- `.github/workflows/deploy-cloud-run.yml` - GitHub Actions workflow

### Testing After Deployment
1. Visit: https://pixelbooth-784690008259.us-central1.run.app/
2. Take a photo
3. Image generation should work now! 🎉

### Troubleshooting
- **403 Forbidden:** Check API key restrictions at https://aistudio.google.com/app/apikey
- **Build fails:** Make sure Docker Desktop is running
- **ZIP timestamp error:** Use Option 1 (Docker build) instead of source deployment

## Security Reminders
- ✅ `.env` is in `.gitignore` - safe from Git
- ✅ Deployment scripts read from `.env` - never hardcode keys
- ✅ GitHub Secret `VITE_GEMINI_API_KEY` is set up
- ❌ NEVER commit the `.env` file or hardcode API keys in code!

## Next Steps
1. Choose one of the options above
2. Deploy with the new API key
3. Test at https://pixelbooth-784690008259.us-central1.run.app/
4. Enjoy your working app! 🎉
