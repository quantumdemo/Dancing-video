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
- **Backend**: FastAPI (Python), Mangum (for serverless deployment).
- **Deployment**: Netlify (Static Hosting + Serverless Functions).

## Local Development

### Prerequisites
- Node.js & npm
- Python 3.9+

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python main.py
```
The API will be available at `http://localhost:8000`.

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The app will be available at `http://localhost:5173`.

## Deployment (Free)

This project is pre-configured for **Netlify**.

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
     - **Functions Directory**: `backend`
4. **Environment Variables** (Optional):
   - If you want to use a specific API base, set `VITE_API_BASE` in the Netlify site settings. Otherwise, it defaults to the local path which is handled by the redirect in `netlify.toml`.

### Why Netlify?
- **Static Hosting**: Free forever for personal projects.
- **Serverless Functions**: Free tier allows for 125,000 requests/month and 100 hours of execution time—perfect for this AI studio prototype.
