from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import shutil
import os
import cv2
import requests
import tempfile

router = APIRouter()

UPLOAD_DIR = "uploaded_videos"
os.makedirs(UPLOAD_DIR, exist_ok=True)

TRACE_MOE_API = "https://api.trace.moe/search"

@router.post('/search_by_video')
def search_by_video(file: UploadFile = File(...)):
    # Save uploaded video
    with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as temp_video:
        shutil.copyfileobj(file.file, temp_video)
        video_path = temp_video.name
    # Extract a frame from the middle of the video
    cap = cv2.VideoCapture(video_path)
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    middle_frame = frame_count // 2
    cap.set(cv2.CAP_PROP_POS_FRAMES, middle_frame)
    ret, frame = cap.read()
    cap.release()
    if not ret:
        os.remove(video_path)
        raise HTTPException(status_code=400, detail="Could not extract frame from video")
    # Save frame as image
    frame_path = video_path + "_frame.jpg"
    cv2.imwrite(frame_path, frame)
    # Send frame to trace.moe
    with open(frame_path, "rb") as img_file:
        files = {"image": img_file}
        response = requests.post(TRACE_MOE_API, files=files)
    os.remove(video_path)
    os.remove(frame_path)
    if response.status_code != 200:
        raise HTTPException(status_code=502, detail="trace.moe API error")
    return JSONResponse(response.json())
