from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import time
import asyncio
import uuid

app = FastAPI(title="AI Media Studio API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VideoReplicationResponse(BaseModel):
    id: str
    status: str
    message: str
    output_url: str
    thumbnail_url: str

class AvatarCreationResponse(BaseModel):
    id: str
    status: str
    message: str
    variations: List[str]

@app.get("/")
async def root():
    return {"message": "AI Media API is running", "version": "1.0.0"}

@app.post("/api/video-replication", response_model=VideoReplicationResponse)
async def video_replication(
    image: UploadFile = File(...),
    video: UploadFile = File(...),
    prompt: str = Form(...)
):
    # Validate file types
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid image format")
    if not video.content_type.startswith("video/"):
        raise HTTPException(status_code=400, detail="Invalid video format")

    # Simulate AI processing
    await asyncio.sleep(3)

    return VideoReplicationResponse(
        id=str(uuid.uuid4()),
        status="success",
        message="Video style replication completed",
        output_url="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        thumbnail_url="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200"
    )

@app.post("/api/avatar-creation", response_model=AvatarCreationResponse)
async def avatar_creation(
    image: UploadFile = File(...),
    style: str = Form(...),
    prompt: str = Form(...),
    resolution: str = Form("512x512"),
    options: Optional[str] = Form(None)
):
    # Validate file types
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid image format")

    import json
    opts = json.loads(options) if options else {"batch": True}

    # Simulate AI processing
    await asyncio.sleep(2)

    variations = [
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"
    ]

    if not opts.get("batch", True):
        variations = variations[:1]

    return AvatarCreationResponse(
        id=str(uuid.uuid4()),
        status="success",
        message=f"Avatar creation in '{style}' style completed",
        variations=variations
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
