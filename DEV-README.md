# Developer Workflow Guide

## Branch Strategy

- **`main`** - Production branch (auto-deploys to Cloud Run)
- **`dev`** - Development branch (for active development)

## Daily Development Workflow

### Working on Features

```bash
# Make sure you're on dev branch
git checkout dev

# Pull latest changes from team
git pull origin dev

# Make your changes in VS Code
# Test locally with: npm run dev

# When ready to commit:
git add .
git commit -m "describe your changes"
git push origin dev
```

### Deploying to Production

**Only do this when dev is stable and tested!**

```bash
# Switch to main branch
git checkout main

# Pull latest from GitHub
git pull origin main

# Merge dev into main
git merge dev

# Push to GitHub - this triggers auto-deploy to Cloud Run!
git push origin main
```

The Cloud Build trigger will automatically:
1. Build the Docker image with the API key
2. Deploy to Cloud Run
3. Update the live site at: https://pixelbooth-784690008259.us-central1.run.app

## Manual Deployment (Backup Method)

If auto-deploy isn't working, you can manually deploy:

```bash
gcloud builds submit --config=cloudbuild.yaml --substitutions=_VITE_GEMINI_API_KEY=AIzaSyD7OgwkxfoR-mSFyJLVI5bdbmuOMAD8k44
```

## Local Development Setup

1. Copy environment template:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Gemini API key:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

3. Run development server:
   ```bash
   npm install
   npm run dev
   ```

## Rolling Back a Bad Deployment

If something breaks in production:

1. Go to [Cloud Run Revisions](https://console.cloud.google.com/run/detail/us-central1/pixelbooth/revisions?project=gen-lang-client-0167114643)
2. Find the last working revision
3. Click the three dots (⋮) → "Manage traffic"
4. Set it to 100% traffic
5. Click SAVE

## Adding Team Members

1. Go to your GitHub repo settings
2. Click "Collaborators"
3. Click "Add people"
4. Enter their GitHub username
5. Give them "Write" access

## Important Notes

- Always test on `dev` branch before merging to `main`
- The API key is restricted to work only from:
  - Production: https://pixelbooth-784690008259.us-central1.run.app/*
  - Local: http://localhost:5173/* and http://localhost:3000/*
- Never commit `.env` files to GitHub (they're in `.gitignore`)
- The API key is baked into the build, so users can see it - that's why it's restricted by domain

## Troubleshooting

**App says "API key is missing":**
- Check build logs to ensure API key was passed during build
- Look for "Building with API key: AIzaSyD..." in Step 8

**Auto-deploy not working:**
- Check [Cloud Build History](https://console.cloud.google.com/cloud-build/builds?project=gen-lang-client-0167114643)
- Verify the trigger has the `_VITE_GEMINI_API_KEY` substitution variable set
- Use manual deployment as backup

**Traffic not going to new revision:**
- Go to Cloud Run service
- Click "Manage traffic"
- Ensure new revision has 100% traffic
