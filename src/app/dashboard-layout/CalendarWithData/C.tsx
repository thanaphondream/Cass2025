import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

interface So2Item {
  id: number;
  so2_name: string;
  so2: number;
  aod: number;
  o3: number;
  flag: number;
}

interface GesItem {
  id: number;
  year: number;
  month: number;
  day: number;
  hours: number;
  so2_id: So2Item[];
}

interface LocationItem {
  id: number;
  name_location: string;
  latitude: number;
  longitude: number;
  date: string;
  ges_id: GesItem[];
}

export default function CalendarFromNestedAPI() {
  const [data, setData] = useState<LocationItem[]>([]);
  const [datesWithData, setDatesWithData] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    axios
      .get<LocationItem[]>("http://localhost:3005/api/gesso2/2025/4")
      .then((res) => {
        setData(res.data);

        // รวมวันที่ทั้งหมดจาก ges_id
        const allDates: Date[] = [];
        res.data.forEach((location) => {
          location.ges_id.forEach((item) => {
            const date = new Date(item.year, item.month - 1, item.day);
            allDates.push(date);
          });
        });

        setDatesWithData(allDates);
      })
      .catch((err) => console.error("API fetch error", err));
  }, []);

  const dataDatesSet = new Set(datesWithData.map((d) => d.toDateString()));
  const filterDate = (date: Date) => dataDatesSet.has(date.toDateString());

  return (
    <div className="p-4">
      <label className="font-bold block mb-2">เลือกวันที่มีข้อมูล</label>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="yyyy-MM-dd"
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        highlightDates={datesWithData}
        filterDate={filterDate}
        className="p-2 border border-gray-300 rounded w-full"
        placeholderText="เลือกวันที่"
      />

      {selectedDate && (
        <div className="mt-4 bg-gray-100 p-4 rounded">
          <h2 className="font-bold">
            ข้อมูลวันที่: {selectedDate.toDateString()}
          </h2>

          {data.map((location) => {
            const filtered = location.ges_id.filter(
              (item) =>
                item.year === selectedDate.getFullYear() &&
                item.month === selectedDate.getMonth() + 1 &&
                item.day === selectedDate.getDate()
            );

            if (filtered.length === 0) return null;

            return (
              <div key={location.id}>
                <h3 className="mt-2 text-blue-600">
                  สถานที่: {location.name_location}
                </h3>
                <ul className="list-disc list-inside">
                  {filtered.map((item) => (
                    <li key={item.id}>
                      {item.hours}:00 - so2:{" "}
                      {item.so2_id[0]?.so2?.toLocaleString() ?? "ไม่มีข้อมูล"}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
