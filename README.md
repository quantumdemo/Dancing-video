# AI Media Studio

A single-page web application for AI-powered video style replication and avatar creation.

## Features

- **Video Style Replication**: Transform images based on video motion and style.
- **Avatar Creator**: Create personalized avatars with multiple styles and batch processing.
- **Responsive UI**: High-performance interface optimized for desktop and mobile.
- **Side-by-Side Comparison**: Compare generated results with original uploads.
- **Privacy Focused**: Real-time processing with local history storage.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons, Framer Motion.
- **Deployment**: Netlify (Static Hosting).

## Local Development

### Prerequisites
- Node.js & npm

### Setup
```bash
cd frontend
npm install
npm run dev
```
The app will be available at `http://localhost:5173`.

## How it Works (Style Simulation)

This application is a **Visual Prototype**. It simulates complex AI video style replication and avatar creation using client-side processing (CSS Filters and Canvas).

- **Video Style Replication**: Analyzes the uploaded video and applies dynamic CSS style filters based on your prompt (e.g., "cyberpunk", "retro", "dark").
- **Avatar Creator**: Generates variations of your uploaded portrait by applying curated filter stacks corresponding to styles like Anime, 3D Pixar, and Watercolor.
- **Why Simulation?**: High-quality AI video generation requires multi-gigabyte models and high-end GPUs. This prototype provides a high-performance, cost-free demonstration of the **User Experience (UX)** and **Interface Logic** without requiring expensive cloud infrastructure.

## Deployment (Free)

This project is pre-configured for **Netlify** as a pure frontend application.

1. **Push to GitHub**: Upload your code to a GitHub repository.
2. **Connect to Netlify**:
   - Sign up/Login to [Netlify](https://www.netlify.com/).
   - Click "Add new site" > "Import from existing project".
   - Select your GitHub repo.
3. **Automatic Configuration**:
   - Netlify will read the `netlify.toml` file in the root.
   - It will automatically set:
     - **Build Command**: `cd frontend && npm install && npm run build`
     - **Publish Directory**: `frontend/dist`

### Why Netlify?
- **Static Hosting**: Free forever for personal projects. This prototype runs entirely in the browser, simulating the AI generation process for demonstration purposes.
