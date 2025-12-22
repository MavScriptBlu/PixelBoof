@echo off
REM Deploy script for Windows

REM Check if .env exists
if not exist .env (
    echo ERROR: .env file not found!
    echo Please create .env with your VITE_GEMINI_API_KEY
    exit /b 1
)

REM Load API key from .env
for /f "usebackq tokens=1,* delims==" %%a in (".env") do (
    if "%%a"=="VITE_GEMINI_API_KEY" set "VITE_GEMINI_API_KEY=%%b"
)

REM Check if API key is set
if "%VITE_GEMINI_API_KEY%"=="" (
    echo ERROR: VITE_GEMINI_API_KEY is not set in .env
    echo Please update .env with your actual API key
    exit /b 1
)

if "%VITE_GEMINI_API_KEY%"=="REPLACE_WITH_YOUR_NEW_API_KEY_HERE" (
    echo ERROR: Please replace the placeholder in .env with your actual API key
    exit /b 1
)

echo Deploying to Cloud Run with API key from .env...
echo API key: %VITE_GEMINI_API_KEY:~0,20%... (showing first 20 chars)
echo.

gcloud run deploy pixelbooth --source . --platform managed --region us-central1 --allow-unauthenticated --build-arg VITE_GEMINI_API_KEY=%VITE_GEMINI_API_KEY%

echo.
echo Deployment complete!
