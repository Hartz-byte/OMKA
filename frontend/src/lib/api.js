import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // Adjust if backend port is different

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const ingestDocument = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/ingest', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const queryBackend = async (queryText) => {
    const response = await api.post('/query', { query: queryText });
    return response.data;
};

export const transcribeAudio = async (audioBlob) => {
    const formData = new FormData();
    const file = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
    formData.append('file', file);
    const response = await api.post('/transcribe', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export default api;
