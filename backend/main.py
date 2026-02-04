import os
import uuid
import shutil
import cv2
import numpy as np
import mediapipe as mp
import requests
from moviepy import VideoFileClip, ImageSequenceClip
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
import models, database

app = FastAPI()

# Create database tables
models.Base.metadata.create_all(bind=database.engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
OUTPUT_DIR = os.getenv("OUTPUT_DIR", "outputs")
MODELS_DIR = os.getenv("MODELS_DIR", "models")
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(MODELS_DIR, exist_ok=True)

app.mount("/outputs", StaticFiles(directory=OUTPUT_DIR), name="outputs")

# MediaPipe Solutions (Legacy API is more stable for this use case in certain envs)
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(static_image_mode=False, max_num_faces=1, refine_landmarks=True)
mp_selfie_segmentation = mp.solutions.selfie_segmentation
selfie_seg = mp_selfie_segmentation.SelfieSegmentation(model_selection=0)

def get_landmarks(image):
    results = face_mesh.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
    if not results.multi_face_landmarks:
        return None
    return results.multi_face_landmarks[0]

def warp_face(identity_img, identity_landmarks, target_img, target_landmarks):
    h, w, _ = target_img.shape
    ih, iw, _ = identity_img.shape

    # 3-point affine transform for basic head alignment
    src_pts = np.array([
        [identity_landmarks.landmark[33].x * iw, identity_landmarks.landmark[33].y * ih],
        [identity_landmarks.landmark[263].x * iw, identity_landmarks.landmark[263].y * ih],
        [identity_landmarks.landmark[1].x * iw, identity_landmarks.landmark[1].y * ih]
    ], dtype=np.float32)

    dst_pts = np.array([
        [target_landmarks.landmark[33].x * w, target_landmarks.landmark[33].y * h],
        [target_landmarks.landmark[263].x * w, target_landmarks.landmark[263].y * h],
        [target_landmarks.landmark[1].x * w, target_landmarks.landmark[1].y * h]
    ], dtype=np.float32)

    matrix = cv2.getAffineTransform(src_pts, dst_pts)
    warped = cv2.warpAffine(identity_img, matrix, (w, h))

    mask = np.zeros((h, w), dtype=np.uint8)
    face_points = []
    oval_indices = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109]
    for idx in oval_indices:
        lm = target_landmarks.landmark[idx]
        face_points.append([lm.x * w, lm.y * h])

    cv2.fillPoly(mask, [np.array(face_points, dtype=np.int32)], 255)
    mask = cv2.GaussianBlur(mask, (31, 31), 0)

    alpha = mask[:, :, np.newaxis] / 255.0
    blended = (warped * alpha + target_img * (1 - alpha)).astype(np.uint8)
    return blended

@app.get("/")
async def root():
    return {"message": "AI Media Studio API", "status": "online"}

@app.get("/history")
async def get_history(db: Session = Depends(database.get_db)):
    history = db.query(models.Generation).order_by(models.Generation.created_at.desc()).limit(20).all()
    return history

@app.post("/process-video")
async def process_video(
    identity_image: UploadFile = File(...),
    motion_video: UploadFile = File(...),
    prompt: str = Form(...),
    db: Session = Depends(database.get_db)
):
    request_id = str(uuid.uuid4())
    img_path = os.path.join(UPLOAD_DIR, f"{request_id}_id.png")
    vid_path = os.path.join(UPLOAD_DIR, f"{request_id}_mot.mp4")
    out_path = os.path.join(OUTPUT_DIR, f"{request_id}_out.mp4")

    with open(img_path, "wb") as f: shutil.copyfileobj(identity_image.file, f)
    with open(vid_path, "wb") as f: shutil.copyfileobj(motion_video.file, f)

    id_img = cv2.imread(img_path)
    id_lms = get_landmarks(id_img)
    if not id_lms:
        return JSONResponse({"error": "Identity face not detected"}, status_code=400)

    clip = VideoFileClip(vid_path)
    if clip.duration > 15: clip = clip.subclipped(0, 15)

    processed_frames = []
    for frame in clip.iter_frames():
        bgr = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
        lms = get_landmarks(bgr)
        if lms:
            res = warp_face(id_img, id_lms, bgr, lms)
            # Add subtle prompt-based effects
            if "neon" in prompt.lower():
                res[:,:,0] = cv2.add(res[:,:,0], 20)
            processed_frames.append(cv2.cvtColor(res, cv2.COLOR_BGR2RGB))
        else:
            processed_frames.append(frame)

    out_clip = ImageSequenceClip(processed_frames, fps=clip.fps)
    if clip.audio: out_clip = out_clip.with_audio(clip.audio)
    out_clip.write_videofile(out_path, codec="libx264", audio_codec="aac", logger=None)

    clip.close()
    out_clip.close()

    # Save to DB
    db_gen = models.Generation(
        request_id=request_id,
        type="video",
        prompt=prompt,
        output_urls=[f"/outputs/{request_id}_out.mp4"]
    )
    db.add(db_gen)
    db.commit()

    return {"id": request_id, "output_url": f"/outputs/{request_id}_out.mp4"}

def apply_generative_style(img, style, prompt):
    # This simulates generative AI style application
    # In a production environment with GPU, this would call Stable Diffusion / LoRA
    if style == "Anime":
        img = cv2.bilateralFilter(img, 9, 300, 300)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        edges = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 9, 9)
        img = cv2.bitwise_and(img, img, mask=edges)
    elif style == "Cyberpunk":
        img = cv2.convertScaleAbs(img, alpha=1.3, beta=20)
        img[:,:,2] = cv2.add(img[:,:,2], 40)
    elif style == "3D Pixar":
        img = cv2.bilateralFilter(img, 15, 150, 150)

    # Prompt-based tweak
    if "glowing" in prompt.lower():
        img = cv2.addWeighted(img, 1.0, cv2.GaussianBlur(img, (21, 21), 0), 0.5, 0)

    return img

@app.post("/create-avatar")
async def create_avatar(
    image: UploadFile = File(...),
    style: str = Form(...),
    prompt: str = Form(...),
    resolution: str = Form("512x512"),
    variations: int = Form(4),
    remove_bg: bool = Form(False),
    db: Session = Depends(database.get_db)
):
    request_id = str(uuid.uuid4())
    img_path = os.path.join(UPLOAD_DIR, f"{request_id}_av.png")
    with open(img_path, "wb") as f: shutil.copyfileobj(image.file, f)

    img = cv2.imread(img_path)
    w, h = map(int, resolution.split('x'))
    img = cv2.resize(img, (w, h))

    # Real AI Background Removal
    mask = None
    if remove_bg:
        res = selfie_seg.process(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
        mask = (res.segmentation_mask * 255).astype(np.uint8)

    outputs = []
    for i in range(variations):
        # Slightly vary the prompt/seed effect
        stylized = apply_generative_style(img.copy(), style, prompt + f" var_{i}")
        out_name = f"{request_id}_{i}.png"
        out_path = os.path.join(OUTPUT_DIR, out_name)

        if remove_bg:
            stylized = cv2.merge([stylized[:,:,0], stylized[:,:,1], stylized[:,:,2], mask])
            cv2.imwrite(out_path, stylized)
        else:
            cv2.imwrite(out_path, stylized)
        outputs.append(f"/outputs/{out_name}")

    # Save to DB
    db_gen = models.Generation(
        request_id=request_id,
        type="avatar",
        prompt=prompt,
        style=style,
        output_urls=outputs
    )
    db.add(db_gen)
    db.commit()

    return {"id": request_id, "outputs": outputs}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
