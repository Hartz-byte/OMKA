import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

export default function VoiceInput({ onTranscript, isTranscribing }) {
    const [isRecording, setIsRecording] = useState(false);
    const [audioLevel, setAudioLevel] = useState(0);
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);
    const animationFrame = useRef(null);
    const audioContext = useRef(null);
    const analyser = useRef(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);
            audioChunks.current = [];

            // For visualizer
            audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
            analyser.current = audioContext.current.createAnalyser();
            const source = audioContext.current.createMediaStreamSource(stream);
            source.connect(analyser.current);
            analyser.current.fftSize = 256;

            const bufferLength = analyser.current.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const updateLevel = () => {
                analyser.current.getByteFrequencyData(dataArray);
                let sum = 0;
                for (let i = 0; i < bufferLength; i++) {
                    sum += dataArray[i];
                }
                setAudioLevel(sum / bufferLength);
                animationFrame.current = requestAnimationFrame(updateLevel);
            };
            updateLevel();

            mediaRecorder.current.ondataavailable = (event) => {
                audioChunks.current.push(event.data);
            };

            mediaRecorder.current.onstop = () => {
                const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
                onTranscript(audioBlob);
                stream.getTracks().forEach(track => track.stop());
                if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
                if (audioContext.current) audioContext.current.close();
            };

            mediaRecorder.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error accessing microphone:", err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder.current && isRecording) {
            mediaRecorder.current.stop();
            setIsRecording(false);
        }
    };

    return (
        <div className="flex items-center gap-4">
            <div className="relative">
                <AnimatePresence>
                    {isRecording && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{
                                scale: 1 + (audioLevel / 100),
                                opacity: 0.3,
                                transition: { type: 'spring', stiffness: 300, damping: 20 }
                            }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="absolute inset-0 bg-brand-500 rounded-full blur-xl"
                        />
                    )}
                </AnimatePresence>

                <button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isTranscribing}
                    className={cn(
                        "relative z-10 p-4 rounded-full transition-all duration-300 transform active:scale-95",
                        isRecording ? "bg-red-500 hover:bg-red-600" : "bg-brand-500 hover:bg-brand-600",
                        isTranscribing && "opacity-50 cursor-not-allowed"
                    )}
                >
                    {isTranscribing ? (
                        <Loader2 className="w-6 h-6 animate-spin text-white" />
                    ) : isRecording ? (
                        <Square className="w-6 h-6 text-white fill-current" />
                    ) : (
                        <Mic className="w-6 h-6 text-white" />
                    )}
                </button>
            </div>

            {isRecording && (
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-sm font-medium text-brand-400 animate-pulse"
                >
                    Listening...
                </motion.div>
            )}
        </div>
    );
}
