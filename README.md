# AI Media Studio

AI-powered single-page application for video identity replacement and custom avatar creation.

## Features
- **Video Style Transfer**: Replace a person's identity in a video with a reference image.
- **Avatar Creator**: Generate stylized avatars with background removal and text prompts.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons.
- **Backend**: Python, FastAPI, MediaPipe (AI Vision), OpenCV, MoviePy.

## Getting Started

### Backend Setup
1. Navigate to the `backend` directory.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the server:
   ```bash
   python main.py
   ```
   The backend will start on `http://localhost:8000`.

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment
- **Frontend**: Deployable on Netlify. Ensure the API URL in `frontend/src/utils/aiSimulation.js` is updated to your hosted backend.
- **Backend**: Requires a Python environment with GPU support recommended for production-grade AI models (e.g., AWS EC2, Render with Docker, or Heroku with a custom buildpack).

## Note on AI Models
This implementation uses MediaPipe for high-performance CPU-based face tracking and background segmentation. Production deployments for high-fidelity generative AI should integrate `diffusers` with Stable Diffusion LoRAs in the backend `apply_generative_style` function.
