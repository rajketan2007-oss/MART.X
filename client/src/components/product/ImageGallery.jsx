import React, { useState } from 'react';

const ImageGallery = ({ images = [] }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  if (images.length === 0) return null;

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails Sidebar */}
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto shrink-0 max-h-[500px]">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIdx(idx)}
            className={`w-16 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
              selectedIdx === idx ? 'border-extrad-pink shadow-md scale-105' : 'border-gray-200 opacity-70 hover:opacity-100'
            }`}
          >
            <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Main Image Preview */}
      <div
        className="flex-1 aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden relative cursor-zoom-in border border-extrad-border group"
        onClick={() => setIsZoomed(!isZoomed)}
      >
        <img
          src={images[selectedIdx]}
          alt="Product Main Preview"
          className={`w-full h-full object-cover transition-transform duration-300 ${
            isZoomed ? 'scale-150 cursor-zoom-out' : 'group-hover:scale-105'
          }`}
        />
        <span className="absolute bottom-3 right-3 text-[10px] font-bold bg-black/60 text-white px-2.5 py-1 rounded-full backdrop-blur-xs">
          {isZoomed ? 'Click to Reset Zoom' : 'Click to Zoom'}
        </span>
      </div>
    </div>
  );
};

export default ImageGallery;
