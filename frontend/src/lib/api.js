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
    let buffer = "";

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process buffer while it contains full metadata segments
        while (buffer.includes('--METADATA_END--')) {
            const endIdx = buffer.indexOf('--METADATA_END--');
            const segment = buffer.substring(0, endIdx);
            buffer = buffer.substring(endIdx + '--METADATA_END--'.length);

            if (segment.includes('--METADATA_START--')) {
                const metaContent = segment.split('--METADATA_START--')[1];
                try {
                    onMetadata(JSON.parse(metaContent.trim()));
                } catch (e) { /* ignore partial/malformed json mid-stream */ }
            } else if (segment.trim()) {
                // Check if it's the initial metadata JSON
                try {
                    const json = JSON.parse(segment.trim());
                    onMetadata(json);
                } catch (e) {
                    // It's not JSON, so it must be raw text tokens before the first separator
                    onToken(segment);
                }
            }
        }

        // Everything left in the buffer that isn't a partial tag is a token
        if (buffer.length > 0 && !buffer.includes('--METADATA')) {
            onToken(buffer);
            buffer = "";
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
