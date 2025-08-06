"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';
import Link from "next/link";

interface MeteorologicalData {
  id: number;
  year: number;
  month: number;
  day: number;
  hours: number;
  temperature: number; 
  humidity: number;
  slp: number;
  rain: number;
  windspeed10m: number;
  winddirection10m: number; 
  lowcloud: number;
  highcloud: number;
  date: string;
}

interface LocationData {
  id: number;
  name_location: string;
  latitude: number;
  longitude: number;
  date: string;
  meteorological_id: MeteorologicalData[];
}

interface LatestLocation {
  name: string;
  latitude: number;
  longitude: number;
  latestData: MeteorologicalData;
}

const LeafletMap = dynamic(() => import('../LeafletMap/page'), { 
  ssr: false,
  loading: () => <div className="h-96 flex items-center justify-center bg-gray-100 rounded-lg">กำลังโหลดแผนที่...</div>
});

export default function HomePage() {
  const router = useRouter();
  const [locationdata, setLocationdata] = useState<LocationData[]>([]);
  const [latestLocations, setLatestLocations] = useState<LatestLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
   const fetchData = async () => {
  try {
    setLoading(true);
    setError(null);
    const response = await fetch("https://cass-api-data.vercel.app/api/locationget");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const jsondata = await response.json();
    console.log("Raw API response:", jsondata);

    if (!Array.isArray(jsondata.Location_find)) {
      throw new Error("API response.Location_find is not an array");
    }

    setLocationdata(jsondata.Location_find);

    const withLatest: LatestLocation[] = jsondata.Location_find
      .map((loc: any) => {
        const latest = [...loc.meteorological_id].sort((a, b) => {
          const dateA = new Date(`${a.date}T${String(a.hours).padStart(2, '0')}:00:00`);
          const dateB = new Date(`${b.date}T${String(b.hours).padStart(2, '0')}:00:00`);
          return dateB.getTime() - dateA.getTime();
        })[0];

        return {
          name: loc.name_location,
          latitude: loc.latitude,
          longitude: loc.longitude,
          latestData: latest,
        };
      })
      .filter((loc: any) => loc.latestData)
      .sort((a:any, b:any) => new Date(b.latestData.date).getTime() - new Date(a.latestData.date).getTime())
      .slice(0, 4);

    setLatestLocations(withLatest);

  } catch (err: any) {
    console.error("Error fetching location data:", err);
    setError("ไม่สามารถโหลดข้อมูลได้ โปรดลองอีกครั้งในภายหลัง");
  } finally {
    setLoading(false);
  }
};

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-xl text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          ลองอีกครั้ง
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen bg-gray-50">
      <div className="ml-auto">
        <Link href="/dashboard-layout/Home/Pm25" className='mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition'>
          ดูข้อมูลpm2.5
        </Link>
      </div>
      <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-center text-blue-700 animate-fade-in-down">
        ค่าพยากรอากาศในแต่ละสถานี 
      </h1>

      <div className="mb-12 h-96 rounded-lg overflow-hidden shadow-lg">
        <LeafletMap locationdata={locationdata} />
      </div>
      <div className="mt-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 border-b-2 border-blue-200 pb-2">
          ✨ 4 สถานที่ที่มีข้อมูลล่าสุด
        </h2>

        {latestLocations.length === 0 ? (
          <p className="text-gray-600 text-center text-lg mt-8">ไม่พบข้อมูลล่าสุดจากสถานีใดๆ</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestLocations.map((loc, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
              >
                <h3 className="font-extrabold text-2xl text-indigo-700 mb-3 border-b-2 border-indigo-100 pb-2">
                  📍 {loc.name}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  🕒 อัปเดตล่าสุด:{" "}
                  <span className="font-medium text-gray-700">
                    {new Date(loc.latestData.date).toLocaleDateString("th-TH", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    เวลา {String(loc.latestData.hours).padStart(2, '0')}:00 น.
                  </span>
                </p>
                <div className="space-y-2 text-base text-gray-700">
                  <p>
                    🌡️ อุณหภูมิ:{" "}
                    <span className="font-semibold text-blue-600">
                      {loc.latestData.temperature}°C
                    </span>
                  </p>
                  <p>
                    💧 ความชื้น:{" "}
                    <span className="font-semibold text-teal-600">
                      {loc.latestData.humidity}%
                    </span>
                  </p>
                  <p>
                    🌧️ ปริมาณฝน:{" "}
                    <span className={`font-semibold ${loc.latestData.rain > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {loc.latestData.rain} มม.
                    </span>
                  </p>
                  <p>
                    💨 ความเร็วลม:{" "}
                    <span className="font-semibold text-purple-600">
                      {loc.latestData.windspeed10m} ม./วินาที
                    </span>
                  </p>
                  <p>
                    🧭 ทิศทางลม:{" "}
                    <span className="font-semibold text-orange-600">
                      {loc.latestData.winddirection10m}°
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}