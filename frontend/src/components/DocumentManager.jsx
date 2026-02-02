import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, History, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ingestDocument } from '../lib/api';
import { cn } from '../lib/utils';

export default function DocumentManager() {
    const [isUploading, setIsUploading] = useState(false);
    const [history, setHistory] = useState([]);
    const [error, setError] = useState(null);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        setError(null);

        try {
            const result = await ingestDocument(file);
            setHistory(prev => [{
                name: file.name,
                time: new Date().toLocaleTimeString(),
                status: 'success',
                chunks: result.num_chunks
            }, ...prev]);
        } catch (err) {
            console.error("Ingestion failed:", err);
            setError("Failed to process document. Make sure the backend is running.");
            setHistory(prev => [{
                name: file.name,
                time: new Date().toLocaleTimeString(),
                status: 'error'
            }, ...prev]);
        } finally {
            setIsUploading(false);
            e.target.value = '';
        }
    };

    return (
        <div className="flex flex-col h-full bg-card/50 p-6 border-r border-border">
            <div className="flex items-center gap-2 mb-8">
                <div className="p-2 bg-brand-500/10 rounded-lg">
                    <FileText className="w-5 h-5 text-brand-400" />
                </div>
                <h2 className="text-lg font-semibold gradient-text">Knowledge Base</h2>
            </div>

            <div className="relative mb-8">
                <label className={cn(
                    "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300",
                    isUploading ? "border-brand-500 bg-brand-500/5" : "border-border hover:border-brand-500/50 hover:bg-white/5"
                )}>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {isUploading ? (
                            <Loader2 className="w-8 h-8 text-brand-400 animate-spin mb-2" />
                        ) : (
                            <Upload className="w-8 h-8 text-zinc-500 mb-2" />
                        )}
                        <p className="text-sm text-zinc-400">
                            {isUploading ? "Processing..." : "Click to upload document"}
                        </p>
                    </div>
                    <input type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
                </label>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="absolute -bottom-6 left-0 right-0 text-[10px] text-red-400 flex items-center gap-1 justify-center"
                        >
                            <AlertCircle size={10} /> {error}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col">
                <div className="flex items-center gap-2 mb-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    <History size={14} />
                    Recently Ingested
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-none">
                    {history.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-xs text-zinc-600">No documents yet</p>
                        </div>
                    ) : (
                        history.map((doc, i) => (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                key={i}
                                className="p-3 rounded-lg bg-zinc-900/50 border border-border group hover:border-zinc-700 transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className={cn(
                                            "p-1.5 rounded-md",
                                            doc.status === 'success' ? "bg-emerald-500/10" : "bg-red-500/10"
                                        )}>
                                            {doc.status === 'success' ? (
                                                <CheckCircle2 size={14} className="text-emerald-500" />
                                            ) : (
                                                <AlertCircle size={14} className="text-red-500" />
                                            )}
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-sm font-medium text-zinc-300 truncate">{doc.name}</p>
                                            <p className="text-[10px] text-zinc-500">{doc.time} • {doc.chunks ? `${doc.chunks} chunks` : 'Error'}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
