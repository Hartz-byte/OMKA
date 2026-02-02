from fastapi import APIRouter, UploadFile
from backend.stt.whisper_stt import transcribe_audio
import shutil

router = APIRouter()

@router.post("/transcribe")
async def transcribe(file: UploadFile):
    path = f"temp_{file.filename}"
    with open(path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    text = transcribe_audio(path)
    return {"text": text}
