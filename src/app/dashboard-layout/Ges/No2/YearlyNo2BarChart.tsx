// components/YearlyNo2BarChart.tsx
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

type No2Entry = {
  id: number;
  no2_name: string;
  no2: number;
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
  no2_id: No2Entry[];
};

type LocationData = {
  id: number;
  name_location: string;
  latitude: number;
  longitude: number;
  date?: string;
  ges_id: GesEntry[];
};

type YearlyChartProps = {
  dataSource: LocationData[];
};

export default function YearlyNo2BarChart({ dataSource }: YearlyChartProps) {
  const groupedByMonth: { [key: number]: number[] } = {};

  dataSource.forEach(location => {
    location.ges_id.forEach((entry) => {
      const month = entry.month;
      const no2Value: any = entry.no2_id?.[0]?.no2;

      if (
        no2Value === undefined ||
        no2Value === 999 ||
        no2Value === "-" ||
        typeof no2Value === "string"
      )
        return;

      if (!groupedByMonth[month]) groupedByMonth[month] = [];

      groupedByMonth[month].push(Number(no2Value));
    });
  });

  const monthNames = [
    "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
  ];

  const labels = Object.keys(groupedByMonth).sort((a,b) => Number(a) - Number(b)).map((monthNum) => monthNames[Number(monthNum) - 1]);
  const avgData = Object.values(groupedByMonth).map((no2List: number[]) => {
    const sum = no2List.reduce((acc: number, val: number) => acc + val, 0);
    return +(sum / no2List.length / 2).toFixed(2);
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: "ค่าเฉลี่ย NO2 รายเดือนในรอบปี (หาร 2)",
        data: avgData,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
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
      <h2 className="text-lg font-bold mb-4">กราฟแท่งแสดงค่าเฉลี่ย NO2 รายปี</h2>
      {avgData.length > 0 ? (
        <Bar data={chartData} options={options} />
      ) : (
        <p>ไม่มีข้อมูล NO2 สำหรับปีที่เลือก</p>
      )}
    </div>
  );
}