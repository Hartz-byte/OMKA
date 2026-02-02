import os
import shutil
from fastapi import APIRouter, UploadFile, HTTPException
from backend.stt.whisper_stt import transcribe_audio

router = APIRouter()

@router.post("/transcribe")
async def transcribe(file: UploadFile):
    path = f"temp_{file.filename}"
    try:
        # Save temp file
        with open(path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        # Attempt transcription
        text = transcribe_audio(path)
        return {"text": text}
    
    except FileNotFoundError as e:
        if "ffmpeg" in str(e).lower() or "[WinError 2]" in str(e):
            raise HTTPException(
                status_code=500, 
                detail="FFmpeg not found. Please install FFmpeg and add it to your PATH (e.g., 'winget install ffmpeg')."
            )
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")
    finally:
        # Cleanup temp file
        if os.path.exists(path):
            os.remove(path)
