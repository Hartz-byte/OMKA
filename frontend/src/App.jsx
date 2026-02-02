import React from 'react';
import ChatInterface from './components/ChatInterface';
import DocumentManager from './components/DocumentManager';

function App() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0a0a0c]">
      {/* Sidebar - Knowledge Base */}
      <aside className="w-80 flex-shrink-0 hidden md:block">
        <DocumentManager />
      </aside>

      {/* Main Content - Chat */}
      <main className="flex-1 relative flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-8 border-b border-border bg-card/30 glass sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <span className="text-white font-bold text-xs">OM</span>
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white">Multimodal Assistant</h1>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Local Engine Active</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-border">
              <span className="text-[10px] text-zinc-500">GPU: NVIDIA RTX 3050</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-hidden">
          <ChatInterface />
        </div>
      </main>
    </div>
  );
}

export default App;
