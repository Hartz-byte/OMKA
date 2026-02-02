import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';
const WS_BASE_URL = 'ws://localhost:8000';

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

/**
 * Streams the query response from the backend.
 * Calls onMetadata when the metadata chunk arrives.
 * Calls onToken as each text token arrives.
 */
export const streamQuery = async (queryText, { onMetadata, onToken, onDone }) => {
    const response = await fetch(`${API_BASE_URL}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let receivedMetadata = false;

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        if (!receivedMetadata && chunk.includes('--METADATA_END--')) {
            const parts = chunk.split('\n--METADATA_END--\n');
            try {
                const metadata = JSON.parse(parts[0]);
                onMetadata(metadata);
                receivedMetadata = true;
                // The rest of the chunk might contain the first tokens
                if (parts[1]) onToken(parts[1]);
            } catch (e) {
                console.error("Error parsing metadata", e);
            }
        } else {
            onToken(chunk);
        }
    }
    if (onDone) onDone();
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

export const getMetrics = async () => {
    const response = await api.get('/metrics');
    return response.data;
};

export { WS_BASE_URL };
export default api;
