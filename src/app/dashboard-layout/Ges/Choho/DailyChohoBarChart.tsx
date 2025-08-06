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

// Register chart components
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
  longitudel: number;
  date?: string;
  ges_id: GesEntry[];
};

type DailyChartProps = {
  dataSource: LocationData[];
};

export default function DailyChohoBarChart({ dataSource }: DailyChartProps) {
  const hourlyData: { label: string; value: number }[] = [];

  dataSource.forEach((location) => {
    location.ges_id.forEach((entry) => {
      const chohoValue: any = entry.choho_id?.[0]?.choho;

      if (
        chohoValue === undefined ||
        chohoValue === 999 ||
        chohoValue === "-" ||
        typeof chohoValue === "string"
      ) {
        return;
      }

      hourlyData.push({
        label: `${entry.hours} น.`,
        value: Number(chohoValue),
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
        label: "ค่า Choho รายชั่วโมง",
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
          text: "เวลา (ชั่วโมง)",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "ค่า Choho",
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y + " ppm";
            }
            return label;
          },
        },
      },
    },
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">กราฟแท่งแสดงค่า Choho รายชั่วโมง</h2>
      {dataValues.length > 0 ? (
        <Bar data={chartData} options={options} />
      ) : (
        <p>ไม่มีข้อมูล Choho สำหรับวันที่เลือก</p>
      )}
    </div>
  );
}
