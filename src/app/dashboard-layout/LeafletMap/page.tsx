// src/app/dashboard-layout/LeafletMap/LeafletMap.tsx
"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

const RAIN_COLORS = {
  HIGH: "#ff0000",
  MEDIUM: "#ffff00",
  LOW: "#00ff00",
};

const getRainColor = (rainValue: number) => {
  if (rainValue > 50) return RAIN_COLORS.HIGH;
  if (rainValue > 20) return RAIN_COLORS.MEDIUM;
  return RAIN_COLORS.LOW;
};

const createCustomIcon = (color: string) =>
  new L.Icon({
    iconUrl: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' fill='${encodeURIComponent(
      color
    )}'><path d='M16 2C9.37 2 4 7.37 4 14c0 8.45 12 16 12 16s12-7.55 12-16c0-6.63-5.37-12-12-12z'/></svg>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

interface LeafletMapProps {
  locationdata: LocationData[];
}

const LeafletMap: React.FC<LeafletMapProps> = ({ locationdata }) => {
  if (!locationdata || locationdata.length === 0) {
    return <p>ไม่มีข้อมูลแสดงแผนที่</p>;
  }

  return (
    <MapContainer center={[15, 100]} zoom={5} style={{ height: "100vh", width: "100%" }} attributionControl={false}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {locationdata.map((location) => {
        if (!location.meteorological_id.length) return null;

        const latestData = [...location.meteorological_id].sort((a, b) => {
          const dateA = new Date(`${a.date}T${String(a.hours).padStart(2, "0")}:00:00`);
          const dateB = new Date(`${b.date}T${String(b.hours).padStart(2, "0")}:00:00`);
          return dateB.getTime() - dateA.getTime();
        })[0];

        const rainColor = getRainColor(latestData.rain);
        const customIcon = createCustomIcon(rainColor);

        return (
          <Marker key={location.id} position={[location.latitude, location.longitude]} icon={customIcon}>
            <Popup>
              <div className="space-y-1">
                <h3 className="font-bold text-lg">{location.name_location}</h3>
                <p className="text-sm text-gray-600">
                  อัปเดต: {new Date(latestData.date).toLocaleDateString("th-TH")}{" "}
                  {String(latestData.hours).padStart(2, "0")}:00 น.
                </p>
                <div className="grid grid-cols-2 gap-1 mt-2">
                  <div className="font-medium">อุณหภูมิ:</div>
                  <div>{latestData.temperature} °C</div>
                  <div className="font-medium">ความชื้น:</div>
                  <div>{latestData.humidity}%</div>
                  <div className="font-medium">ปริมาณฝน:</div>
                  <div style={{ color: rainColor }} className="font-semibold">
                    {latestData.rain} มม.
                  </div>
                  <div className="font-medium">ความเร็วลม:</div>
                  <div>{latestData.windspeed10m} ม./วินาที</div>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default LeafletMap;
