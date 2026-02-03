import React from 'react';
import { Video, UserCircle } from 'lucide-react';

const ModeToggle = ({ mode, setMode }) => {
  return (
    <div className="flex p-1 bg-dark-gray rounded-xl border border-white/5 w-fit">
      <button
        onClick={() => setMode('video')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
          mode === 'video'
            ? 'bg-primary-blue text-white shadow-lg'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        <Video size={18} />
        <span className="font-medium whitespace-nowrap">Video Style Transfer</span>
      </button>
      <button
        onClick={() => setMode('avatar')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
          mode === 'avatar'
            ? 'bg-primary-blue text-white shadow-lg'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        <UserCircle size={18} />
        <span className="font-medium whitespace-nowrap">Avatar Creator</span>
      </button>
    </div>
  );
};

export default ModeToggle;
