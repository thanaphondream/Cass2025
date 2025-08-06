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

type Location = {
  id: number;
  name_location: string;
  latitude: number;
  longitude: number;
  date: string;
  ges_id: GesEntry[];
};
type Props = {
  dataSource: Location;
};

export default function DailySo2BarChart({ dataSource }: Props) {
  const groupedByDay:any = {};

  dataSource.ges_id.forEach((entry) => {
    const day = entry.day;
    const so2Value: any = entry.so2_id?.[0]?.so2;

    if (
      so2Value === undefined ||
      so2Value === 999 ||
      so2Value === "-" ||
      typeof so2Value === "string"
    ) return;

    if (!groupedByDay[day]) groupedByDay[day] = [];

    groupedByDay[day].push(Number(so2Value));
  });

  const labels = Object.keys(groupedByDay).map((day) => `วันที่ ${day}`);
  const avgData = Object.values(groupedByDay).map((so2List: any) => {
    const sum = so2List.reduce((acc: any, val: any) => acc + val, 0);
    return +(sum / so2List.length / 2).toFixed(2);
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: "ค่าเฉลี่ย SO2 (หาร 2)",
        data: avgData,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
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
      <h2 className="text-lg font-bold mb-4">กราฟแท่งแสดงค่าเฉลี่ย SO2</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
}
