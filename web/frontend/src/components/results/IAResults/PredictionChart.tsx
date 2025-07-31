import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const COLORS = ["#007B95", "#8EA780", "#558B98", "#C1C1C1"];

interface PredictionData {
  label: string;
  value: number;
}

interface PredictionChartProps {
  data?: PredictionData[];
}

const defaultData: PredictionData[] = [
  { label: "Normal", value: 35 },
  { label: "Lesión Leve", value: 25 },
  { label: "Lesión Grave", value: 20 },
  { label: "Inconcluso", value: 20 },
];

const PredictionChart: React.FC<PredictionChartProps> = ({ data = defaultData }) => {
  return (
    <div className="w-full h-96 p-4 bg-white border rounded-xl shadow-sm">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Predicción del Modelo IA</h3>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            cx="50%"
            cy="50%"
            outerRadius={90}
            fill="#007B95"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `${value}%`} />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PredictionChart;