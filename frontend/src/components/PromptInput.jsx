import React from 'react';
import { Sparkles } from 'lucide-react';

const PromptInput = ({ prompt, setPrompt, placeholder, buttonText, onGenerate, loading }) => {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-400">Prompt Engineering</label>
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-dark border border-white/10 rounded-2xl p-4 min-h-[120px] focus:border-primary-blue outline-none transition-all text-sm resize-none"
        />
        <button
          onClick={onGenerate}
          disabled={loading || !prompt}
          className={`absolute bottom-4 right-4 flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${
            loading || !prompt
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-primary-red text-white hover:scale-105 active:scale-95 shadow-lg shadow-primary-red/20'
          }`}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Sparkles size={18} />
          )}
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default PromptInput;
