from fastapi.testclient import TestClient
from backend.main import app
import io

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["message"] == "AI Media API is running"

def test_video_replication_invalid_file():
    # Test with invalid file types
    files = {
        "image": ("test.txt", io.BytesIO(b"hello"), "text/plain"),
        "video": ("video.mp4", io.BytesIO(b"video"), "video/mp4")
    }
    response = client.post("/api/video-replication", files=files, data={"prompt": "test"})
    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid image format"

def test_avatar_creation_success():
    # Test with valid image
    files = {
        "image": ("test.png", io.BytesIO(b"fake-image-data"), "image/png")
    }
    response = client.post("/api/avatar-creation", files=files, data={"style": "anime", "prompt": "test"})
    assert response.status_code == 200
    assert "variations" in response.json()
    assert len(response.json()["variations"]) == 4
