"use client";
import { useEffect, useState } from "react";
import { Results } from "@/lib/api";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ResultsPage() {
  const [data, setData] = useState<{ id: string; name: string; total: number }[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setData(await Results.list());
      } catch (e: any) {
        setErr(e.message);
      }
    })();
  }, []);

  const chartData = {
    labels: data.map((d) => d.name),
    datasets: [{ label: "Votes", data: data.map((d) => d.total) }],
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900">Results</h1>
      {err && <p className="text-sm text-red-600">{err}</p>}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        {data.length > 0 ? <Bar data={chartData} /> : <p className="text-gray-700">No data yet.</p>}
      </div>
    </div>
  );
}
