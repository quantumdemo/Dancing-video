# Deployment Guide: AI Media Studio

This guide explains how to deploy the AI Media Studio on various platforms with free database and storage tiers.

## Architecture Overview
- **Frontend**: React (Vite) - Deployable on Netlify, Vercel, or GitHub Pages.
- **Backend**: FastAPI (Python) - Deployable on Render, Railway, or Fly.io.
- **Database**: PostgreSQL - Available via Render (Free Tier), Railway, or Supabase.
- **File Storage**: Ephemeral (Local) or Cloud (Supabase Storage / AWS S3).

---

## 1. Deploying the Backend (Render)

Render is recommended for the backend as it offers a free tier for Web Services and PostgreSQL.

### Step A: Create a PostgreSQL Database
1. Go to [Render Dashboard](https://dashboard.render.com/).
2. Click **New** > **PostgreSQL**.
3. Name it `ai-media-db` and click **Create Database**.
4. Once created, copy the **Internal Database URL** or **External Database URL**.

### Step B: Create a Web Service
1. Click **New** > **Web Service**.
2. Connect your GitHub repository.
3. **Environment**: `Python 3`.
4. **Build Command**: `pip install -r backend/requirements.txt`.
5. **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`.
6. Click **Advanced** and add **Environment Variables**:
   - `DATABASE_URL`: Paste your PostgreSQL URL.
   - `PYTHON_VERSION`: `3.10` or higher.
7. Click **Create Web Service**.

---

## 2. Deploying the Frontend (Netlify / Vercel)

The frontend is a static site that communicates with your Render backend.

### Step A: Build & Deploy
1. Connect your repo to Netlify or Vercel.
2. **Build Command**: `cd frontend && npm install && npm run build`.
3. **Publish Directory**: `frontend/dist`.
4. Add **Environment Variable**:
   - `VITE_API_URL`: Your Render Web Service URL (e.g., `https://ai-media-backend.onrender.com`).

---

## 3. Persistent File Storage (Optional but Recommended)

Since Render's filesystem is ephemeral, uploaded/generated files will be lost when the server restarts. To prevent this, use **Supabase Storage**.

### Integrating Supabase Storage:
1. Create a project at [Supabase](https://supabase.com/).
2. Create a public bucket named `media`.
3. Add your `SUPABASE_URL` and `SUPABASE_KEY` to your backend environment variables.
4. (Optional) Update `backend/main.py` to upload files to Supabase instead of writing to the local `outputs/` directory.

---

## 4. Local Development
To run locally with a persistent database:
1. Ensure `DATABASE_URL` is NOT set (it will default to `sqlite:///./sql_app.db`).
2. Run backend: `cd backend && uvicorn main:app --reload`.
3. Run frontend: `cd frontend && npm run dev`.

---

## Troubleshooting
- **CORS Errors**: Ensure `allow_origins=["*"]` is set in `backend/main.py` (already implemented).
- **Cold Starts**: Render's free tier spins down after inactivity. The first request after a break may take 30-60 seconds.
