import whisper
from backend.config import WHISPER_MODEL
from backend.core.logger import logger

_model = whisper.load_model(WHISPER_MODEL)

def transcribe_audio(audio_path: str) -> str:
    logger.info("Transcribing audio")
    result = _model.transcribe(audio_path)
    return result["text"]
