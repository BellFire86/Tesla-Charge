
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import ChargingStationCard from './components/ChargingStationCard';
import MapView from './components/MapView';
import { findNearbyTeslaStations } from './services/geminiService';
import { SearchResult, UserLocation } from './types';

type ViewMode = 'list' | 'map';

const App: React.FC = () => {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SearchResult | null>(null);
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const requestLocation = useCallback(() => {
    setLoading(true);
    setError(null);
    
    if (!navigator.geolocation) {
      setError("이 브라우저는 위치 서비스를 지원하지 않습니다.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocation(coords);
        setPermissionState('granted');
        searchChargers(coords);
      },
      (err) => {
        console.error(err);
        setPermissionState('denied');
        setError("위치 권한이 거부되었습니다. 근처 충전소를 찾으려면 위치 공유를 허용해 주세요.");
        setLoading(false);
      }
    );
  }, []);

  const searchChargers = async (coords: UserLocation) => {
    try {
      const result = await findNearbyTeslaStations(coords);
      setData(result);
    } catch (err: any) {
      setError(err.message || "충전소 정보를 가져오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto max-w-4xl px-6 py-10">
        {!location && permissionState === 'prompt' && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-red-600/10 rounded-full flex items-center justify-center mb-8">
              <i className="fa-solid fa-charging-station text-4xl text-red-600"></i>
            </div>
            <h2 className="text-3xl font-bold mb-4">가까운 테슬라 충전소 찾기</h2>
            <p className="text-gray-400 mb-10 max-w-md">
              실시간 위치 정보를 사용하여 현재 위치에서 가장 가까운 슈퍼차저와 데스티네이션 차저를 찾아보세요.
            </p>
            <button 
              onClick={requestLocation}
              disabled={loading}
              className="bg-white text-black font-bold py-4 px-10 rounded-full hover:bg-gray-200 transition-all flex items-center gap-3 disabled:opacity-50"
            >
              {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-location-dot"></i>}
              주변 충전소 검색 시작
            </button>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 border-4 border-red-600/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-red-600 rounded-full animate-spin"></div>
            </div>
            <p className="text-lg font-medium text-gray-300 animate-pulse">
              가장 빠른 충전소를 찾는 중...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-900/50 p-6 rounded-2xl flex items-start gap-4 mb-8">
            <i className="fa-solid fa-circle-exclamation text-red-500 mt-1"></i>
            <div>
              <h3 className="font-bold text-red-500">오류 발생</h3>
              <p className="text-gray-300">{error}</p>
              <button 
                onClick={requestLocation}
                className="mt-4 text-sm font-bold underline hover:text-red-400"
              >
                다시 시도하기
              </button>
            </div>
          </div>
        )}

        {data && !loading && (
          <div className="space-y-8">
            {/* View Mode Toggle */}
            <div className="flex justify-center mb-4">
              <div className="bg-[#111] p-1 rounded-full border border-white/10 flex gap-1">
                <button 
                  onClick={() => setViewMode('list')}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${viewMode === 'list' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                >
                  <i className="fa-solid fa-list-ul"></i> 목록 보기
                </button>
                <button 
                  onClick={() => setViewMode('map')}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${viewMode === 'map' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                >
                  <i className="fa-solid fa-map"></i> 지도 보기
                </button>
              </div>
            </div>

            <section>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <i className="fa-solid fa-comment-dots text-red-500"></i>
                AI Assistant 분석
              </h2>
              <div className="bg-[#111] border border-white/5 p-6 rounded-2xl leading-relaxed text-gray-300">
                {data.text.split('\n').map((line, i) => (
                  <p key={i} className={line ? 'mb-2' : 'h-1'} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<b class="text-white">$1</b>') }} />
                ))}
              </div>
            </section>

            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <i className="fa-solid fa-location-crosshairs text-red-500"></i>
                  {viewMode === 'list' ? `검색된 충전소 (${data.stations.length})` : '주변 충전소 지도'}
                </h2>
              </div>

              {viewMode === 'list' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {data.stations.map((station, index) => (
                    <ChargingStationCard key={index} station={station} />
                  ))}
                  {data.stations.length === 0 && (
                    <div className="col-span-full py-10 text-center text-gray-500 border border-dashed border-white/10 rounded-2xl">
                      검색된 구체적인 충전소 정보가 없습니다.
                    </div>
                  )}
                </div>
              ) : (
                <div className="animate-in fade-in zoom-in-95 duration-500">
                   {location && <MapView location={location} />}
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      <footer className="py-10 text-center border-t border-white/5 mt-auto">
        <p className="text-xs text-gray-600 uppercase tracking-widest">
          &copy; {new Date().getFullYear()} Tesla Finder Service. Powered by Gemini & Google Maps.
        </p>
      </footer>
    </div>
  );
};

export default App;
