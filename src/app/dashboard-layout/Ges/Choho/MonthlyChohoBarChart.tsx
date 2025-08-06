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

// เปลี่ยนชื่อ type เป็น ChohoEntry
type ChohoEntry = {
  id: number;
  choho_name: string;
  choho: number;
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
  choho_id: ChohoEntry[];
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
  dataSource: LocationData[];
};

export default function MonthlyChohoBarChart({ dataSource }: MonthlyChartProps) {
  const groupedByDayInMonth: { [key: number]: number[] } = {};

  dataSource.forEach(location => {
    location.ges_id.forEach((entry) => {
      const day = entry.day;
      const chohoValue: any = entry.choho_id?.[0]?.choho;

      if (
        chohoValue === undefined ||
        chohoValue === 999 ||
        chohoValue === "-" ||
        typeof chohoValue === "string"
      )
        return;

      if (!groupedByDayInMonth[day]) groupedByDayInMonth[day] = [];

      groupedByDayInMonth[day].push(Number(chohoValue));
    });
  });

  const labels = Object.keys(groupedByDayInMonth)
    .sort((a, b) => Number(a) - Number(b))
    .map((day) => `วันที่ ${day}`);

  const avgData = Object.values(groupedByDayInMonth).map((chohoList: number[]) => {
    const sum = chohoList.reduce((acc, val) => acc + val, 0);
    return +(sum / chohoList.length / 2).toFixed(2); // แบ่ง 2 ถ้ายังคงต้องการแบบเดิม
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: "ค่าเฉลี่ย CHOHO รายวันในเดือน (หาร 2)",
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
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "ค่า CHOHO",
        },
      },
      x: {
        title: {
          display: true,
          text: "วันที่ในเดือน",
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || "";
            if (label) label += ": ";
            if (context.parsed.y !== null) label += context.parsed.y + " ppm";
            return label;
          },
        },
      },
    },
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">กราฟแท่งแสดงค่าเฉลี่ย CHOHO รายเดือน</h2>
      {avgData.length > 0 ? (
        <Bar data={chartData} options={options} />
      ) : (
        <p>ไม่มีข้อมูล CHOHO สำหรับเดือนที่เลือก</p>
      )}
    </div>
  );
}
