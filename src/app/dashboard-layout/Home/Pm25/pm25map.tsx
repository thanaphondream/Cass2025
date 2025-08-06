"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Pm25 {
  id: number;
  color_id: number;
  aqi: number;
  value: number;
}

interface Ari4 {
  id: number;
  area: string;
  nameTH: string;
  lat: string | number;
  long: string | number;
  pm25_id: Pm25[];
}

const getPm25Color = (value: number): string => {
  if (value > 50) return "#ff0000"; // แดง = อากาศแย่
  if (value > 25) return "#ffff00"; // เหลือง = ปานกลาง
  return "#00ff00"; // เขียว = ดี
};

const createCustomIcon = (color: string) =>
  new L.Icon({
    iconUrl: `data:image/svg+xml;utf8,
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' fill='${encodeURIComponent(
        color
      )}'><circle cx='16' cy='16' r='14'/></svg>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

export default function LeafletPmMap({ data }: { data: Ari4[] }) {
  return (
    <MapContainer
      center={[15.0, 100.0]}
      zoom={5}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {data.map((item) => {
        const pm25 = item.pm25_id?.[0];
        if (!pm25 || pm25.value === -1) return null;

        const color = getPm25Color(pm25.value);
        const icon = createCustomIcon(color);

        return (
          <Marker
            key={item.id}
            position={[parseFloat(item.lat as string), parseFloat(item.long as string)]}
            icon={icon}
          >
            <Popup>
              <div className="text-sm">
                <strong>{item.nameTH}</strong>
                <p>{item.area}</p>
                <p>
                  PM2.5: <span style={{ color }}>{pm25.value} μg/m³</span>
                </p>
                <p>AQI: {pm25.aqi}</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
