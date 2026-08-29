
import React from 'react';

interface MascotProps {
  mood?: 'happy' | 'thinking' | 'alert';
}

const Mascot: React.FC<MascotProps> = ({ mood = 'happy' }) => {
  // We use the provided brand mascot image
  const logoUrl = "https://i.ibb.co/XfRVZqR5/RMH-Mascot-Ayurveda.png";

  return (
    <div className="relative w-32 h-32 mx-auto mb-6 animate-float">
      <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-3xl opacity-40"></div>
      <div className="relative w-full h-full flex items-center justify-center">
        <img 
          src={logoUrl} 
          alt="Bunny My Prakriti Mascot" 
          className={`w-full h-full object-contain transition-transform duration-500 ${
            mood === 'thinking' ? 'scale-95 grayscale-[20%]' : 
            mood === 'alert' ? 'scale-105 saturate-[120%]' : 'scale-100'
          }`}
        />
      </div>
      
      {/* Visual indicator for mood if needed, though the mascot image is the primary focus */}
      {mood === 'alert' && (
        <div className="absolute top-0 right-0 w-4 h-4 bg-orange-500 border-2 border-white rounded-full animate-pulse"></div>
      )}
      {mood === 'thinking' && (
        <div className="absolute -top-2 -right-2 flex gap-1">
          <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
        </div>
      )}
    </div>
  );
};

export default Mascot;
