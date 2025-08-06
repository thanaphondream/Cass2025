"use client";
import {useState, useEffect} from 'react'
import LeafletPmMap from './pm25map';
import Link from "next/link";

interface Ari4{
    id: number;
    year: number;
    month: number;
    day: number;
    hours: number;
    createdAt: Date;
    area: string;
    nameTH: string;
    nameEN: string;
    stationType: string;
    lat: number;
    long: number;
    location_id: Location[];
    pm25_id: Pm25[];
    pm10_id: Pm10[];
}

interface Location {
    id: number;
    name_location: string;
    latitude: number;
    longitude: number;
    date: Date;
}

interface Pm25 {
    id: number;
    color_id: number;
    aqi: number
    value: number
}

interface Pm10{
    id: number;
    color_id: number;
    aqi: number;
    value: number
}

const page = () => {
    const [pmnow, setPmnom] = useState<Ari4[]>([])

    useEffect(() => {
        const datasowrs = async () => {
            try{
                const rs = await fetch("http://10.90.1.118:3001/api/pmshownow")
                const rs_json = await rs.json()
                setPmnom(rs_json)
            }catch(err){
                console.error("เกิดข้อผิดพลาด", err)
            }
        }
        datasowrs()
    }, [pmnow])
 return (
  <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen bg-gray-50">
    <div className='ml-auto'>
       <Link href="/dashboard-layout/Home/" className='mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition'>
          เปลี่ยนดูค่าพยากรอากาศ
    </Link>

    </div>
    <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-center text-green-700 animate-fade-in-down">
      🌫️ ค่าฝุ่นละออง PM2.5 จากสถานีต่างๆ 🌫️
    </h1>

     <div className="mb-12 h-96 rounded-lg overflow-hidden shadow-lg">
      <LeafletPmMap data={pmnow} />
    </div>

    <div className="mt-10">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 border-b-2 border-green-200 pb-2">
        🏙️ สถานีตรวจวัดคุณภาพอากาศล่าสุด
      </h2>

      {pmnow.length === 0 ? (
        <p className="text-gray-600 text-center text-lg mt-8">ไม่พบข้อมูล PM2.5 จากสถานีใดๆ</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pmnow.map((item) => {
            const pm25 = item.pm25_id[0];
            return (
              <div
                key={item.id}
                className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
              >
                <h3 className="font-extrabold text-2xl text-indigo-700 mb-3 border-b-2 border-indigo-100 pb-2">
                  📍 {item.nameTH}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  📅 วันที่:{" "}
                  <span className="font-medium text-gray-700">
                    {item.day}/{item.month}/{item.year} เวลา {String(item.hours).padStart(2, '0')}:00 น.
                  </span>
                </p>
                <div className="space-y-2 text-base text-gray-700">
                  <p>
                    🗺️ พื้นที่:{" "}
                    <span className="font-semibold text-blue-600">{item.area}</span>
                  </p>
                  <p>
                    🌫️ ค่าฝุ่น PM2.5:{" "}
                    <span
                      className={`font-semibold ${
                        pm25.value > 50
                          ? 'text-red-600'
                          : pm25.value > 25
                          ? 'text-yellow-600'
                          : 'text-green-600'
                      }`}
                    >
                      {pm25.value} μg/m³
                    </span>
                  </p>
                  <p>
                    📊 ค่า AQI:{" "}
                    <span className="font-semibold text-purple-600">{pm25.aqi}</span>
                  </p>
                  <p>
                    🎨 ระดับสี:{" "}
                    <span className="font-semibold text-gray-600">#{pm25.color_id}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  </div>
);

}

export default page