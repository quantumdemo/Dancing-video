import React, { useState } from 'react';
import { Download, Share2, Maximize2, RefreshCw, X, Eye } from 'lucide-react';

const ResultsPanel = ({ results, loading, progress, isOpen, onClose }) => {
  const [comparisonMode, setComparisonMode] = useState(false);

  const PanelContent = () => (
    <>
      <div className="p-6 border-b border-white/5 flex justify-between items-center">
        <h2 className="text-lg font-bold flex items-center gap-2">
          Results
          {loading && <RefreshCw size={16} className="animate-spin text-primary-blue" />}
        </h2>
        <div className="flex items-center gap-2">
          {results.length > 0 && (
            <button
              onClick={() => setComparisonMode(!comparisonMode)}
              className={`p-2 rounded-lg transition-colors ${comparisonMode ? 'bg-primary-blue text-white' : 'bg-white/5 text-gray-400'}`}
              title="Toggle Side-by-Side"
            >
              <Eye size={18} />
            </button>
          )}
          <button onClick={onClose} className="xl:hidden text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {loading && (
          <div className="space-y-4">
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-gray-400">Processing Media...</span>
              <span className="text-primary-blue">{progress}%</span>
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-primary-blue h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="aspect-square rounded-2xl bg-white/5 animate-pulse flex items-center justify-center border border-white/5">
               <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Generating...</span>
            </div>
          </div>
        )}

        {!loading && results.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
              <RefreshCw size={24} />
            </div>
            <p className="text-sm">Upload media and click generate to see results here.</p>
          </div>
        )}

        {!loading && results.map((result, idx) => (
          <div key={idx} className="group relative space-y-3">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 group-hover:border-primary-blue transition-all">
              {comparisonMode && result.original ? (
                <div className="grid grid-cols-2 gap-px bg-white/10">
                  <div className="aspect-square relative">
                    {result.original ? (
                      <img src={result.original} alt="Original" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-[8px] text-gray-500">ORIGINAL</div>
                    )}
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/60 rounded text-[8px] font-bold uppercase tracking-widest">Original</div>
                  </div>
                  <div className="aspect-square relative">
                    {result.type === 'video' ? (
                      <video src={result.url} className="w-full h-full object-cover" autoPlay loop muted />
                    ) : (
                      <img src={result.url} alt="Result" className="w-full h-full object-cover" />
                    )}
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-primary-blue/80 rounded text-[8px] font-bold uppercase tracking-widest">Result</div>
                  </div>
                </div>
              ) : (
                <div className="aspect-square relative">
                  {result.type === 'video' ? (
                    <video src={result.url} className="w-full h-full object-cover" controls />
                  ) : (
                    <img src={result.url} alt="Result" className="w-full h-full object-cover" />
                  )}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 bg-black/60 rounded-lg text-white hover:bg-primary-blue transition-colors">
                      <Maximize2 size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-primary-blue/20 hover:text-primary-blue py-2 rounded-xl text-xs font-bold transition-all border border-white/5">
                <Download size={14} />
                EXPORT
              </button>
              <button className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all text-gray-400">
                <Share2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <>
      <div className="hidden xl:flex w-80 bg-dark-gray border-l border-white/5 flex-col h-full">
        <PanelContent />
      </div>

      {isOpen && (
        <div className="xl:hidden fixed inset-0 z-[70] flex justify-end">
           <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
           <aside className="relative w-full max-w-sm bg-dark-gray h-full flex flex-col shadow-2xl border-l border-white/10">
             <PanelContent />
           </aside>
        </div>
      )}
    </>
  );
};

export default ResultsPanel;
