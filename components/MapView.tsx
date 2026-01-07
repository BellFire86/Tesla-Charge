
import React from 'react';
import { UserLocation } from '../types';

interface Props {
  location: UserLocation;
}

const MapView: React.FC<Props> = ({ location }) => {
  // Google Maps Search Embed URL
  // API_KEY를 쿼리에 포함하되, public embed 방식(output=embed)은 키 없이도 기본 작동하는 경우가 많으나 
  // 일관성을 위해 템플릿을 구성합니다.
  const mapUrl = `https://www.google.com/maps?q=Tesla+Supercharger&ll=${location.latitude},${location.longitude}&z=13&output=embed`;

  return (
    <div className="w-full h-[500px] rounded-3xl overflow-hidden border border-white/10 bg-[#111] shadow-2xl relative">
      <iframe
        title="Tesla Supercharger Map"
        width="100%"
        height="100%"
        style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }} // 다크모드 느낌을 위한 필터 적용
        src={mapUrl}
        allowFullScreen
      ></iframe>
      <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-[10px] text-white/60 uppercase tracking-widest pointer-events-none">
        Live Map Data
      </div>
    </div>
  );
};

export default MapView;
