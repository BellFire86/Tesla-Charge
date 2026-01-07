
import React from 'react';
import { ChargingStation } from '../types';

interface Props {
  station: ChargingStation;
}

const ChargingStationCard: React.FC<Props> = ({ station }) => {
  return (
    <div className="bg-[#111] border border-white/5 rounded-2xl p-6 hover:border-red-600/50 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white group-hover:text-red-500 transition-colors">
            {station.title}
          </h3>
          <p className="text-sm text-gray-400 mt-1">테슬라 전용 충전 시설</p>
        </div>
        <a 
          href={station.uri} 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-white/10 hover:bg-white text-white hover:text-black p-3 rounded-full transition-all"
          title="Google Maps에서 보기"
        >
          <i className="fa-solid fa-location-arrow"></i>
        </a>
      </div>
      
      {station.snippets && station.snippets.length > 0 && (
        <div className="mt-4 space-y-2">
          {station.snippets.slice(0, 2).map((snippet, idx) => (
            <p key={idx} className="text-xs text-gray-500 italic leading-relaxed">
              "{snippet}"
            </p>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center gap-4 text-xs font-medium text-gray-400 uppercase tracking-widest">
        <span className="flex items-center gap-1">
          <i className="fa-solid fa-bolt text-red-500"></i> Supercharger
        </span>
        <span className="w-1 h-1 bg-white/20 rounded-full"></span>
        <span>24/7</span>
      </div>
    </div>
  );
};

export default ChargingStationCard;
