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

type YearlyChartProps = {
  dataSource: LocationData[]; // This will be locationShowdatayaer
};

export default function YearlyChohoBarChart({ dataSource }: YearlyChartProps) {
  const groupedByMonth: { [key: number]: number[] } = {};

  dataSource.forEach(location => {
    location.ges_id.forEach((entry) => {
      const month = entry.month;
      const chohoValue: any = entry.choho_id?.[0]?.choho;

      if (
        chohoValue === undefined ||
        chohoValue === 999 ||
        chohoValue === "-" ||
        typeof chohoValue === "string"
      )
        return;

      if (!groupedByMonth[month]) groupedByMonth[month] = [];

      groupedByMonth[month].push(Number(chohoValue));
    });
  });

  const monthNames = [
    "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
  ];

  const labels = Object.keys(groupedByMonth)
    .sort((a, b) => Number(a) - Number(b))
    .map((monthNum) => monthNames[Number(monthNum) - 1]);

  const avgData = Object.values(groupedByMonth).map((chohoList: number[]) => {
    const sum = chohoList.reduce((acc: number, val: number) => acc + val, 0);
    return +(sum / chohoList.length / 2).toFixed(2);
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: "ค่าเฉลี่ย CHOHO รายเดือนในรอบปี (หาร 2)",
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
          text: "เดือน",
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
      <h2 className="text-lg font-bold mb-4">กราฟแท่งแสดงค่าเฉลี่ย CHOHO รายปี</h2>
      {avgData.length > 0 ? (
        <Bar data={chartData} options={options} />
      ) : (
        <p>ไม่มีข้อมูล CHOHO สำหรับปีที่เลือก</p>
      )}
    </div>
  );
}
