
import React, { useEffect, useState } from 'react';
import { Dosha } from '../types';
import { DOSHA_COLORS } from '../constants';

const DoshaClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getDoshaForHour = (hour: number): Dosha => {
    if ((hour >= 2 && hour < 6) || (hour >= 14 && hour < 18)) return Dosha.VATA;
    if ((hour >= 10 && hour < 14) || (hour >= 22 || hour < 2)) return Dosha.PITTA;
    return Dosha.KAPHA; // 6-10 and 18-22
  };

  const currentHour = time.getHours();
  const currentDosha = getDoshaForHour(currentHour);

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative w-32 h-32 sm:w-44 sm:h-44 rounded-full border border-slate-100 flex items-center justify-center bg-white shadow-inner">
        <svg viewBox="0 0 100 100" className="absolute inset-0 transform -rotate-90">
          <circle cx="50" cy="50" r="46" className="fill-none stroke-slate-50" strokeWidth="4" />
          <circle 
            cx="50" cy="50" r="46" 
            className="fill-none transition-all duration-1000" 
            stroke={DOSHA_COLORS[currentDosha]} 
            strokeWidth="4" 
            strokeDasharray="25 100"
            strokeDashoffset={-((currentHour / 24) * 100)}
            strokeLinecap="round"
          />
        </svg>

        <div className="text-center z-10">
          <div className="text-xl sm:text-3xl font-light tracking-tight text-slate-800">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
          </div>
          <div className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.2em] mt-1" style={{ color: DOSHA_COLORS[currentDosha] }}>
            {currentDosha}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoshaClock;
