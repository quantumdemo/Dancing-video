import React from 'react';

const styles = [
  { id: 'anime', label: 'Anime', img: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&q=80&w=200' },
  { id: '3d-pixar', label: '3D Pixar', img: 'https://images.unsplash.com/photo-1594465919760-441fe5908ab0?auto=format&fit=crop&q=80&w=200' },
  { id: 'cyberpunk', label: 'Cyberpunk', img: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=200' },
  { id: 'watercolor', label: 'Watercolor', img: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=200' },
  { id: 'gaming', label: 'Gaming', img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=200' },
];

const StyleSelector = ({ selectedStyle, setSelectedStyle }) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-400">Style Presets</label>
        <button className="text-[10px] text-primary-blue hover:underline">View All</button>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        {styles.map((style) => (
          <button
            key={style.id}
            onClick={() => setSelectedStyle(style.id)}
            className={`flex-shrink-0 group relative w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${
              selectedStyle === style.id ? 'border-primary-blue' : 'border-transparent hover:border-white/20'
            }`}
          >
            <img src={style.img} alt={style.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2">
              <span className="text-[10px] font-bold text-white uppercase tracking-wider">{style.label}</span>
            </div>
          </button>
        ))}
        <button className="flex-shrink-0 w-24 h-24 rounded-xl border-2 border-dashed border-white/10 hover:border-primary-blue/50 bg-white/5 flex flex-col items-center justify-center text-gray-500 hover:text-primary-blue transition-all">
          <span className="text-2xl font-light">+</span>
          <span className="text-[8px] font-bold uppercase">Custom</span>
        </button>
      </div>
    </div>
  );
};

export default StyleSelector;
