<!-- @format -->

# Pixel Boof

Welcome to Pixel Boof! This application transforms your webcam photos into unique, retro video game-inspired characters using the power of generative AI. Step into the booth, strike a pose, and see yourself reimagined in the style of your favorite classic games.
Originally named Pixel Booth, but due to Big-Money-Makers taking the fun outta everything, it was renamed and re-imagined as Pixel Boof

## 🚀 Overview

Pixel Boof is an interactive web application that captures images from your webcam, applies a selected artistic style via a generative AI model, and presents you with a unique, stylized portrait. Whether you want to see yourself as an 8-bit hero, a fighter from a classic arcade game, or a character from a fantasy RPG, Pixel Boof makes it happen in a few clicks.

## ✨ Features

- **Live Camera Preview**: See a real-time feed from your webcam.

- **Digital Zoom**: Use the slider (desktop) or pinch-to-zoom (mobile) to frame your perfect shot.

- **Retro Video Game Styles**: Choose from a wide array of modes, each with a unique prompt to transform your photo into a character inspired by games you grew up with.

- **Custom Prompts**: Feeling creative? Use the "Custom" mode to write your own prompt and generate a completely unique image.

- **Instant Generation**: Once you take a photo, it's sent to the Google Gemini model, which generates a new, stylized image based on your chosen mode.

- **Interactive Gallery**: All your creations are saved in a gallery. View them, delete them, or select your favorites.

- **Sticker Queue**: Easily save your favorite creations to a special queue, perfect for event workflows.

- **Batch Download**: Download all items in your sticker queue as a single ZIP file, making it easy to transfer images for printing.

- **Download & Share**: Easily download your photos or use the native share functionality on your device.

- **Responsive Design**: Enjoy a seamless experience on both desktop and mobile devices.

- **First-Use Tutorial**: A quick and easy tutorial guides new users through the main features.

## 🕹️ How to Use

1. **Start the App**: When you first open the app, you'll see a start screen. Click anywhere on screen when you see "PRESS START" to grant camera access and begin.

2. **Choose Your Style**: Along the bottom of the screen, you'll find a carousel of different modes. Each one represents a different video game style without stepping on toes. Select the one you like.

3. **Frame Your Shot**: Position yourself in front of the camera. Use the zoom slider on the left (or pinch on mobile) to adjust the zoom.

4. **Snap a Photo**: Click the big camera shutter button to take a picture. You'll see a flash effect on the screen.

5. **See the Magic**: Your photo is now being processed by the AI. A thumbnail will appear in the photo bar at the bottom with a shimmer effect, indicating it's busy. Once complete, the final, stylized image will replace the thumbnail.

### Gallery and Sticker Queue

- **View Photos**: Click the "Gallery" button in the top-right corner to view all your creations.

- **Save for Sticker**: When viewing a photo, click the "Save for Sticker" button to add it to your print queue.

- **Batch Download**: In the gallery, click the "Sticker Queue" button to see all your saved images. From there, you can download them all in a single ZIP file, perfect for an efficient printing workflow.

## 🛠️ How It Works (Technical Details)

Pixel Boof is a modern frontend application that leverages the following technologies:

- **AI Model**: The core of the application uses the Google Gemini API (gemini-2.5-flash-image model). It takes the user's photo and a text prompt as input and generates a new, stylized image.

- **Frontend Framework**: Built with React for a dynamic and responsive user interface.

- **State Management**: Uses Zustand for simple, efficient global state management, centralizing all application state and actions in a single store.

- **Camera Access**: The app uses the browser's native WebRTC API (navigator.mediaDevices.getUserMedia) to access the webcam feed.

- **Image Processing**: The HTML Canvas API is used to:

  - Capture a still frame from the live video stream.
  - Convert the image to a Base64-encoded JPEG to be sent to the Gemini API.

- **Asynchronous Operations**: Uses p-limit to control the concurrency of API requests to the Gemini model, preventing rate-limiting issues and ensuring a smooth experience.

### API Breakdown

- **External API**

  - **Google Gemini API (gemini-2.5-flash-image model)**: This is the main engine of the app. It's responsible for taking the user's photo and the text prompt and generating the final stylized image. The `src/lib/gemini.js` file is dedicated to communicating with this API.

- **Browser APIs**
  The app relies heavily on APIs built directly into modern web browsers:

  - **MediaDevices API (getUserMedia)**: Used to request access to and stream video from your webcam.

  - **Canvas API**: Used to capture, crop, and format frames from the video stream for the Gemini API.

  - **Web Share API (navigator.share)**: Powers the "Share" button on supported devices.

  - **Web Storage API (localStorage)**: Used to remember user preferences (disclaimer acceptance, tutorial dismissal).

- **Supporting External Services**

  - **Google Fonts API**: Fetches the custom pixelated font (`Press Start 2P`) for the UI's retro aesthetic.

_To summarize, the app's core magic comes from one primary external API (Google Gemini), while its interactive features are powered by four key browser-native APIs._

### 📂 Project Structure

- **index.html**: The main entry point of the application.

- **index.tsx**: Mounts the React application to the DOM.

- **index.css**: Global styles for the entire application.

- **src/components/App.jsx**: The root component that orchestrates views and modals.

- **src/components/common/**: Shared, reusable components like the `Header`.

- **src/components/Camera/**: Components exclusively for the Camera View.

  - `CameraView.jsx`: The main component for the camera interface.

- **src/components/Gallery/**: Components exclusively for the Gallery View.

  - `GalleryView.jsx`: The main component for displaying the photo gallery.

- **src/components/modals/**: All modal dialog components (`Disclaimer`, `Tutorial`, `FocusedPhotoModal`, etc.).

- **src/lib/store.js**: The central Zustand store, containing all application state and action logic.

- **src/lib/gemini.js**: A dedicated module for communicating with the Google Gemini API, including retry logic and error handling.

- **src/lib/modes.js**: A configuration file defining all available creative styles and their AI prompts.

- **src/lib/imageData.js**: An in-memory cache for base64 image data to keep the main state performant.


---


## You can make your own! Just follow these steps ---- 🚀 Deployment to Google Cloud Run

### Prerequisites

1. **Get a Gemini API Key**
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create or select an API key
   - **IMPORTANT**: Restrict your API key to your deployment domain for security

2. **Install Google Cloud CLI**
   - Follow instructions at [cloud.google.com/sdk/docs/install](https://cloud.google.com/sdk/docs/install)
   - Run `gcloud auth login` to authenticate

### Local Development Setup

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Gemini API key:
   ```
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

3. Run the development server:
   ```bash
   npm install
   npm run dev
   ```

### Deploy to Cloud Run

1. **Set your Google Cloud project:**
   ```bash
   gcloud config set project YOUR_PROJECT_ID
   ```

2. **Build and deploy in one command:**
   ```bash
   gcloud run deploy pixelbooth \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --build-arg VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

   Replace `your_actual_api_key_here` with your actual Gemini API key.

3. **After deployment**, Cloud Run will provide a URL like: `https://pixelbooth-xxxxx-uc.a.run.app`

### Secure Your API Key

Since this is a client-side app, the API key will be visible in the browser. Protect it by:

1. Go to [Google Cloud Console → APIs & Credentials](https://console.cloud.google.com/apis/credentials)
2. Find your Gemini API key
3. Click "Edit API key"
4. Under "Application restrictions", select "HTTP referrers"
5. Add your Cloud Run URL:
   ```
   https://pixelbooth-xxxxx-uc.a.run.app/*
   ```
6. Click "Save"

Now your API key will ONLY work from your deployed domain, preventing unauthorized use even if someone finds it.
