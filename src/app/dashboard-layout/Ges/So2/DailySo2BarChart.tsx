// components/DailySo2BarChart.tsx
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
  longitudel: number; // Corrected typo: longitude
  date?: string;
  ges_id: GesEntry[];
};

type DailyChartProps = {
  dataSource: LocationData[];
};

export default function DailySo2BarChart({ dataSource }: DailyChartProps) {
  const hourlyData: { label: string; value: number }[] = [];

  dataSource.forEach((location) => {
    // Assuming you're passing daily data, so ges_id should contain entries for a single day
    location.ges_id.forEach((entry) => {
      const so2Value: any = entry.so2_id?.[0]?.so2;

      if (
        so2Value === undefined ||
        so2Value === 999 ||
        so2Value === "-" ||
        typeof so2Value === "string"
      ) {
        return; // Skip invalid data
      }

      hourlyData.push({
        label: `${entry.hours} น.`, // Label for the hour
        value: Number(so2Value), // The raw SO2 value
      });
    });
  });

  // Sort data by hour to ensure chronological order on the chart
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
        label: "ค่า SO2 รายชั่วโมง",
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
          text: 'ค่า SO2',
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
                        label += context.parsed.y + ' ppm'; // Assuming ppm as unit for SO2
                    }
                    return label;
                }
            }
        }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">กราฟแท่งแสดงค่า SO2 รายชั่วโมง</h2>
      {dataValues.length > 0 ? (
        <Bar data={chartData} options={options} />
      ) : (
        <p>ไม่มีข้อมูล SO2 สำหรับวันที่เลือก</p>
      )}
    </div>
  );
}