import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Quote, Sparkles, ShieldAlert, BadgeCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { streamQuery, transcribeAudio } from '../lib/api';
import VoiceInput from './VoiceInput';
import { cn } from '../lib/utils';

export default function ChatInterface() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (queryText = input) => {
        if (!queryText.trim() || isLoading) return;

        const userMessage = { role: 'user', content: queryText };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // Create a placeholder bot message for streaming
        const botMessageId = Date.now();
        setMessages(prev => [...prev, {
            id: botMessageId,
            role: 'bot',
            content: '',
            sources: [],
            score: 0,
            isStreaming: true
        }]);

        let currentContent = '';

        try {
            await streamQuery(queryText, {
                onMetadata: (data) => {
                    setMessages(prev => prev.map(msg =>
                        msg.id === botMessageId
                            ? { ...msg, sources: data.sources, score: data.hallucination_score }
                            : msg
                    ));
                },
                onToken: (token) => {
                    currentContent += token;
                    setMessages(prev => prev.map(msg =>
                        msg.id === botMessageId
                            ? { ...msg, content: currentContent }
                            : msg
                    ));
                },
                onDone: () => {
                    setMessages(prev => prev.map(msg =>
                        msg.id === botMessageId
                            ? { ...msg, isStreaming: false }
                            : msg
                    ));
                    setIsLoading(false);
                }
            });
        } catch (err) {
            console.error("Query failed:", err);
            setMessages(prev => prev.map(msg =>
                msg.id === botMessageId
                    ? { ...msg, content: "Sorry, I'm having trouble connecting. Is the backend running?", isError: true, isStreaming: false }
                    : msg
            ));
            setIsLoading(false);
        }
    };

    const handleVoiceTranscript = async (audioBlob) => {
        setIsTranscribing(true);
        try {
            const result = await transcribeAudio(audioBlob);
            if (result.text) {
                setInput(result.text);
                // Automatically send if transcription is successful
                handleSend(result.text);
            }
        } catch (err) {
            console.error("Transcription failed:", err);
        } finally {
            setIsTranscribing(false);
        }
    };

    return (
        <div className="flex flex-col h-full max-w-5xl mx-auto px-4 py-6">
            <div className="flex-1 overflow-y-auto space-y-8 pb-32 scrollbar-none" ref={scrollRef}>
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-30 text-center space-y-4">
                        <Sparkles size={64} className="text-brand-500 animate-pulse-slow" />
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">OMKA</h1>
                            <p className="text-sm">Ask anything about your documents</p>
                        </div>
                    </div>
                ) : (
                    messages.map((msg, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={msg.id || i}
                            className={cn(
                                "flex gap-4",
                                msg.role === 'user' ? "justify-end" : "justify-start"
                            )}
                        >
                            {msg.role === 'bot' && (
                                <div className="w-8 h-8 rounded-full bg-brand-500/10 flex items-center justify-center shrink-0 border border-brand-500/20">
                                    <Bot size={16} className="text-brand-400" />
                                </div>
                            )}

                            <div className={cn(
                                "max-w-[80%] space-y-3",
                                msg.role === 'user' ? "items-end" : "items-start"
                            )}>
                                <div className={cn(
                                    "p-4 rounded-2xl text-sm leading-relaxed",
                                    msg.role === 'user'
                                        ? "bg-brand-600 text-white rounded-tr-none shadow-lg shadow-brand-500/20"
                                        : "bg-zinc-900 border border-border rounded-tl-none"
                                )}>
                                    {msg.content}
                                </div>

                                {msg.role === 'bot' && !msg.isError && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="space-y-4"
                                    >
                                        {/* Sources */}
                                        {msg.sources && msg.sources.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {msg.sources.map((source, si) => (
                                                    <div key={si} className="flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-800/50 border border-zinc-700/50 text-[10px] text-zinc-400">
                                                        <Quote size={10} />
                                                        {source}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Grounding Metric */}
                                        <div className={cn(
                                            "flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-medium w-fit",
                                            msg.score < 0.3
                                                ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-500"
                                                : "bg-amber-500/5 border-amber-500/20 text-amber-500"
                                        )}>
                                            {msg.score < 0.3 ? <BadgeCheck size={12} /> : <ShieldAlert size={12} />}
                                            Grounding Confidence Score: {(1 - msg.score).toFixed(2)}
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {msg.role === 'user' && (
                                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 border border-border">
                                    <User size={16} className="text-zinc-400" />
                                </div>
                            )}
                        </motion.div>
                    ))
                )}
                {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-brand-500/10 flex items-center justify-center animate-pulse border border-brand-500/20">
                            <Bot size={16} className="text-brand-400" />
                        </div>
                        <div className="flex gap-1 items-center py-2">
                            <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </motion.div>
                )}
            </div>

            <div className="fixed bottom-8 inset-x-0 mx-auto max-w-3xl px-4">
                <div className="glass rounded-2xl p-2 glow flex items-center gap-2">
                    <VoiceInput onTranscript={handleVoiceTranscript} isTranscribing={isTranscribing} />

                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your question..."
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-white placeholder:text-zinc-500 px-2"
                    />

                    <button
                        onClick={() => handleSend()}
                        disabled={isLoading || !input.trim()}
                        className={cn(
                            "p-3 rounded-xl transition-all",
                            input.trim() ? "bg-brand-500 text-white hover:bg-brand-600" : "text-zinc-500 cursor-not-allowed"
                        )}
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
