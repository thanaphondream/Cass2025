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

type YearlyChartProps = {
  dataSource: LocationData[]; // This will be locationShowdatayaer
};

export default function YearlySo2BarChart({ dataSource }: YearlyChartProps) {
  const groupedByMonth: { [key: number]: number[] } = {};

  // Loop through locations (usually one for a yearly view)
  dataSource.forEach(location => {
    location.ges_id.forEach((entry) => {
      const month = entry.month;
      const so2Value: any = entry.so2_id?.[0]?.so2;

      if (
        so2Value === undefined ||
        so2Value === 999 ||
        so2Value === "-" ||
        typeof so2Value === "string"
      )
        return;

      if (!groupedByMonth[month]) groupedByMonth[month] = [];

      groupedByMonth[month].push(Number(so2Value));
    });
  });

  const monthNames = [
    "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
  ];

  const labels = Object.keys(groupedByMonth).sort((a,b) => Number(a) - Number(b)).map((monthNum) => monthNames[Number(monthNum) - 1]);
  const avgData = Object.values(groupedByMonth).map((so2List: number[]) => {
    const sum = so2List.reduce((acc: number, val: number) => acc + val, 0);
    // As per your request: "ถ้าเป็นรายปีให้รวมค่าในแต่ละเดือนแล้วมาหาร2"
    // This implies we sum all values for a month and then divide by 2.
    // However, if you mean average *then* divide by 2, the previous logic holds.
    // I'm assuming you meant average for the month, and then that average is divided by 2,
    // consistent with your daily and monthly charts. If you truly mean sum / 2, please clarify.
    return +(sum / so2List.length / 2).toFixed(2);
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: "ค่าเฉลี่ย SO2 รายเดือนในรอบปี (หาร 2)",
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
      <h2 className="text-lg font-bold mb-4">กราฟแท่งแสดงค่าเฉลี่ย SO2 รายปี</h2>
      {avgData.length > 0 ? (
        <Bar data={chartData} options={options} />
      ) : (
        <p>ไม่มีข้อมูล SO2 สำหรับปีที่เลือก</p>
      )}
    </div>
  );
}