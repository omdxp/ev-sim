import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const chartTheme = {
  backgroundColor: "transparent",
  textColor: "#9ca3af",
  fontSize: 12,
  axisColor: "#4b5563",
  gridColor: "#374151",
};

type PowerData = {
  hour: number;
  power: number;
};

type DailyPowerChartProps = {
  data: PowerData[];
};

function DailyPowerChart({ data }: DailyPowerChartProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} />
          <XAxis
            dataKey="hour"
            tickFormatter={(hour) => `${hour}:00`}
            stroke={chartTheme.axisColor}
            tick={{ fill: chartTheme.textColor }}
          />
          <YAxis
            stroke={chartTheme.axisColor}
            tick={{ fill: chartTheme.textColor }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "none",
              borderRadius: "0.5rem",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            }}
            itemStyle={{ color: "#e5e7eb" }}
            formatter={(value: number) => [`${value.toFixed(1)} kW`, "Power"]}
            labelFormatter={(hour) => `${hour}:00`}
          />
          <Legend wrapperStyle={{ color: chartTheme.textColor }} />
          <Line
            type="monotone"
            dataKey="power"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, fill: "#3b82f6" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

type TimeScale = "hourly" | "daily" | "weekly" | "monthly";

type TimeScaleChartProps = {
  data: number[];
  timeScale: TimeScale;
  title: string;
};

function TimeScaleChart({ data, timeScale, title }: TimeScaleChartProps) {
  // Filter out any data beyond 12 months for monthly view
  const processedData = useMemo(
    () => (timeScale === "monthly" ? data.slice(0, 12) : data),
    [data, timeScale]
  );

  const chartData = useMemo(
    () =>
      processedData.map((value, index) => ({
        index: getTimeLabel(timeScale, index),
        events: value,
      })),
    [processedData, timeScale]
  );

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} />
          <XAxis
            dataKey="index"
            label={{
              value: getAxisLabel(timeScale),
              position: "insideBottom",
              offset: -5,
            }}
            stroke={chartTheme.axisColor}
            tick={{ fill: chartTheme.textColor }}
          />
          <YAxis
            label={{
              value: "Number of Events",
              angle: -90,
              position: "insideLeft",
            }}
            stroke={chartTheme.axisColor}
            tick={{ fill: chartTheme.textColor }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "node",
              borderRadius: "0.5rem",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            }}
            itemStyle={{ color: "#e5e7eb" }}
            formatter={(value: number) => [value, "Events"]}
            labelFormatter={(index) => getTooltipLabel(timeScale, index)}
          />
          <Legend wrapperStyle={{ color: chartTheme.textColor }} />
          <Bar dataKey="events" fill="#82ca9d" name={title} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function getTimeLabel(timeScale: TimeScale, index: number): string | number {
  switch (timeScale) {
    case "monthly":
      return new Date(0, index).toLocaleString("en-US", { month: "short" });
    case "weekly":
      return `Week ${index + 1}`;
    default:
      return index;
  }
}

function getAxisLabel(timeScale: TimeScale): string {
  switch (timeScale) {
    case "monthly":
      return "Month";
    case "weekly":
      return "Week";
    case "hourly":
      return "Hour";
    default:
      return "Day";
  }
}

function getTooltipLabel(timeScale: TimeScale, index: number): string {
  switch (timeScale) {
    case "monthly":
      return `Month ${index}`;
    case "weekly":
      return `Week ${index};`;
    case "hourly":
      return `Hour ${index}`;
    default:
      return `Day ${index}`;
  }
}

const exports = {
  DailyPowerChart,
  TimeScaleChart,
};

export default exports;
