
import React from 'react';
import { PrakritiState, VikritiState, Dosha } from '../types';
import { DOSHA_COLORS } from '../constants';

interface RadarChartProps {
  prakriti: PrakritiState;
  vikriti?: VikritiState;
}

const RadarChart: React.FC<RadarChartProps> = ({ prakriti, vikriti }) => {
  const size = 260;
  const center = size / 2;
  const radius = 80;

  const getPoint = (dosha: Dosha, percentage: number) => {
    let angle = 0;
    if (dosha === Dosha.VATA) angle = -Math.PI / 2;
    if (dosha === Dosha.PITTA) angle = (2 * Math.PI) / 3 - Math.PI / 2;
    if (dosha === Dosha.KAPHA) angle = (4 * Math.PI) / 3 - Math.PI / 2;

    const r = (Math.max(percentage, 5) / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const prakritiPoints = [
    getPoint(Dosha.VATA, prakriti.vata),
    getPoint(Dosha.PITTA, prakriti.pitta),
    getPoint(Dosha.KAPHA, prakriti.kapha),
  ];
  
  const prakritiPath = prakritiPoints.map(p => `${p.x},${p.y}`).join(' ');

  const vikritiPath = vikriti ? [
    getPoint(Dosha.VATA, vikriti.vata),
    getPoint(Dosha.PITTA, vikriti.pitta),
    getPoint(Dosha.KAPHA, vikriti.kapha),
  ].map(p => `${p.x},${p.y}`).join(' ') : null;

  return (
    <div className="flex justify-center items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* Background Grid Lines */}
        {[25, 50, 75, 100].map((r) => (
          <polygon
            key={r}
            points={[Dosha.VATA, Dosha.PITTA, Dosha.KAPHA]
              .map(d => {
                const p = getPoint(d, r);
                return `${p.x},${p.y}`;
              })
              .join(' ')}
            className="fill-none stroke-slate-100"
            strokeWidth="1"
          />
        ))}

        {/* Axis Lines */}
        {[Dosha.VATA, Dosha.PITTA, Dosha.KAPHA].map(d => {
          const p = getPoint(d, 100);
          return <line key={d} x1={center} y1={center} x2={p.x} y2={p.y} className="stroke-slate-100" strokeWidth="1" />;
        })}
        
        {/* Axis Labels */}
        <text x={center} y={center - radius - 15} textAnchor="middle" fill={DOSHA_COLORS[Dosha.VATA]} className="text-[10px] font-bold uppercase">Vata</text>
        <text x={center + radius + 15} y={center + radius / 2 + 5} textAnchor="start" fill={DOSHA_COLORS[Dosha.PITTA]} className="text-[10px] font-bold uppercase">Pitta</text>
        <text x={center - radius - 15} y={center + radius / 2 + 5} textAnchor="end" fill={DOSHA_COLORS[Dosha.KAPHA]} className="text-[10px] font-bold uppercase">Kapha</text>

        {/* Prakriti Layer */}
        <polygon
          points={prakritiPath}
          className="fill-indigo-500/10 stroke-indigo-500"
          strokeWidth="2"
        />

        {/* Vikriti Layer */}
        {vikritiPath && (
          <polygon
            points={vikritiPath}
            className="fill-none stroke-slate-900"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
        )}
      </svg>
    </div>
  );
};

export default RadarChart;
