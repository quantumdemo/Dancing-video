import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';

const UploadArea = ({ label, type, file, setFile, accept, multiple }) => {
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      if (multiple) {
        setFile(files);
      } else {
        setFile(files[0]);
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="flex flex-col gap-2 flex-1">
      <label className="text-sm font-medium text-gray-400">{label}</label>
      <div
        onClick={() => !file && inputRef.current?.click()}
        className={`relative h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${
          file
            ? 'border-primary-blue bg-primary-blue/5'
            : 'border-white/10 hover:border-primary-blue/50 bg-white/5 hover:bg-white/10'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept={accept}
          multiple={multiple}
        />

        {file ? (
          <div className="w-full h-full relative group">
            {type === 'image' ? (
              <img src={preview} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                <VideoIcon size={40} className="text-primary-blue" />
                <span className="text-xs text-gray-400 truncate max-w-[80%]">{file.name}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <button
                onClick={(e) => { e.stopPropagation(); clearFile(); }}
                className="bg-primary-red p-2 rounded-full text-white hover:scale-110 transition-transform"
               >
                 <X size={20} />
               </button>
            </div>
          </div>
        ) : (
          <>
            {type === 'image' ? <ImageIcon className="text-gray-500 mb-2" size={32} /> : <VideoIcon className="text-gray-500 mb-2" size={32} />}
            <span className="text-sm text-gray-400">Click to upload {type}</span>
            <span className="text-[10px] text-gray-500 mt-1 uppercase">
              {type === 'image' ? 'JPG, PNG, WebP' : 'MP4, MOV, WebM (Max 100MB)'}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default UploadArea;
