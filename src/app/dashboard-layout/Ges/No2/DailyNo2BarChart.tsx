// components/DailyNo2BarChart.tsx
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
  longitude: number; // Corrected typo: longitude
  date?: string;
  ges_id: GesEntry[];
};

type DailyChartProps = {
  dataSource: LocationData[];
};

export default function DailyNo2BarChart({ dataSource }: DailyChartProps) {
  const hourlyData: { label: string; value: number }[] = [];

  dataSource.forEach((location) => {
    location.ges_id.forEach((entry) => {
      const no2Value: any = entry.no2_id?.[0]?.no2;

      if (
        no2Value === undefined ||
        no2Value === 999 ||
        no2Value === "-" ||
        typeof no2Value === "string"
      ) {
        return;
      }

      hourlyData.push({
        label: `${entry.hours} น.`,
        value: Number(no2Value),
      });
    });
  });

  hourlyData.sort((a, b) => {
    const hourA = parseInt(a.label.split(' ')[0]);
    const hourB = parseInt(b.label.split(' ')[0]);
    return hourA - hourB;
  });

  const labels = hourlyData.map((data) => data.label);
  const dataValues = hourlyData.map((data) => data.value);

  const chartData = {
    labels,
    datasets: [
      {
        label: "ค่า NO2 รายชั่วโมง",
        data: dataValues,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'เวลา (ชั่วโมง)',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'ค่า NO2',
        },
      },
    },
    plugins: {
        tooltip: {
            callbacks: {
                label: function(context: any) {
                    let label = context.dataset.label || '';
                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed.y !== null) {
                        label += context.parsed.y + ' ppb'; // Assuming ppb as a common unit for NO2
                    }
                    return label;
                }
            }
        }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">กราฟแท่งแสดงค่า NO2 รายชั่วโมง</h2>
      {dataValues.length > 0 ? (
        <Bar data={chartData} options={options} />
      ) : (
        <p>ไม่มีข้อมูล NO2 สำหรับวันที่เลือก</p>
      )}
    </div>
  );
}