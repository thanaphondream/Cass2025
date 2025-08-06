// components/MonthlySo2BarChart.tsx
"use client";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type So2Entry = {
  id: number;
  so2_name: string;
  so2: number;
  aod: number;
  o3: number;
  flag: number;
};

type GesEntry = {
  id: number;
  year: number;
  month: number;
  day: number;
  hours: number;
  so2_id: So2Entry[];
};

type LocationData = {
  id: number;
  name_location: string;
  latitude: number;
  longitude: number;
  date?: string;
  ges_id: GesEntry[];
};

type MonthlyChartProps = {
  dataSource: LocationData[]; // This will be locationShowdatamonth
};

export default function MonthlySo2BarChart({ dataSource }: MonthlyChartProps) {
  const groupedByDayInMonth: { [key: number]: number[] } = {};

  // Loop through locations (though usually it's one location for a monthly view)
  dataSource.forEach(location => {
    location.ges_id.forEach((entry) => {
      const day = entry.day;
      const so2Value: any = entry.so2_id?.[0]?.so2;

      if (
        so2Value === undefined ||
        so2Value === 999 ||
        so2Value === "-" ||
        typeof so2Value === "string"
      )
        return;

      if (!groupedByDayInMonth[day]) groupedByDayInMonth[day] = [];

      groupedByDayInMonth[day].push(Number(so2Value));
    });
  });

  const labels = Object.keys(groupedByDayInMonth).sort((a,b) => Number(a) - Number(b)).map((day) => `วันที่ ${day}`);
  const avgData = Object.values(groupedByDayInMonth).map((so2List: number[]) => {
    const sum = so2List.reduce((acc: number, val: number) => acc + val, 0);
    return +(sum / so2List.length / 2).toFixed(2);
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: "ค่าเฉลี่ย SO2 รายวันในเดือน (หาร 2)",
        data: avgData,
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">กราฟแท่งแสดงค่าเฉลี่ย SO2 รายเดือน</h2>
      {avgData.length > 0 ? (
        <Bar data={chartData} options={options} />
      ) : (
        <p>ไม่มีข้อมูล SO2 สำหรับเดือนที่เลือก</p>
      )}
    </div>
  );
}