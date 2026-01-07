
import { GoogleGenAI } from "@google/genai";
import { SearchResult, ChargingStation, UserLocation } from "../types";

export const findNearbyTeslaStations = async (location: UserLocation): Promise<SearchResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `현재 내 위치(${location.latitude}, ${location.longitude})를 기준으로 가장 가까운 테슬라 슈퍼차저(Supercharger)와 데스티네이션 차저(Destination Charger)를 찾아줘. 
  각 충전소의 위치, 특징(충전 속도, 주변 시설 등)을 간단히 설명해줘. 답변은 한국어로 해줘.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: location.latitude,
              longitude: location.longitude
            }
          }
        }
      },
    });

    const text = response.text || "충전소를 찾을 수 없습니다.";
    const stations: ChargingStation[] = [];

    // Extract grounding chunks for specific links
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.maps) {
          stations.push({
            title: chunk.maps.title || "테슬라 충전소",
            uri: chunk.maps.uri,
            snippets: chunk.maps.placeAnswerSources?.map((s: any) => s.reviewSnippets).flat() || []
          });
        }
      });
    }

    return { text, stations };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("충전소 정보를 가져오는 중 오류가 발생했습니다.");
  }
};
