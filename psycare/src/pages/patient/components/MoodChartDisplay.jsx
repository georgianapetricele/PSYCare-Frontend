import { useMemo } from "react";
import { Box } from "@chakra-ui/react";
import {
  MoodChart,
  ChartTitle,
  ChartSvg,
  ChartLine,
  ChartPath,
  ChartDot,
  ChartDotLabel,
  ChartBarLabel,
  EmptyMessage,
} from "../StyledComponents";

export const MoodChartDisplay = ({ moodEntries, title = "Last 7 entries" }) => {
  const chartData = useMemo(() => {
    if (!moodEntries || moodEntries.length === 0) return [];

    const recent = moodEntries.slice(0, 7).reverse();
    return recent.map((entry) => ({
      value: Number(entry.score) || 0,
      label: new Date(entry.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      raw: entry,
    }));
  }, [moodEntries]);

  const chartPoints = useMemo(() => {
    if (!chartData.length) return { points: [], path: "", gridY: [] };

    const width = 320;
    const height = 180;
    const padX = 32;
    const padY = 18;
    const minVal = 1;
    const maxVal = 10;
    const usableW = width - padX * 2;
    const usableH = height - padY * 2;

    const scaleX = (idx) =>
      chartData.length === 1
        ? width / 2
        : padX + (idx / (chartData.length - 1)) * usableW;
    const scaleY = (val) =>
      padY + (1 - (val - minVal) / (maxVal - minVal)) * usableH;

    const points = chartData.map((item, idx) => ({
      ...item,
      x: scaleX(idx),
      y: scaleY(item.value),
    }));

    const path = points
      .map((p, idx) => `${idx === 0 ? "M" : "L"}${p.x},${p.y}`)
      .join(" ");

    const gridY = [10, 8, 6, 4, 2].map((val) => ({
      y: scaleY(val),
      label: val,
    }));

    return { points, path, gridY, width, height, padX, padY };
  }, [chartData]);

  return (
    <MoodChart>
      <ChartTitle>{title}</ChartTitle>
      {chartData.length === 0 ? (
        <EmptyMessage>No data to chart yet.</EmptyMessage>
      ) : (
        <Box>
          <ChartSvg viewBox={`0 0 ${chartPoints.width} ${chartPoints.height}`}>
            {chartPoints.gridY.map((g, idx) => (
              <ChartLine
                key={`grid-${idx}`}
                x1={chartPoints.padX}
                x2={chartPoints.width - chartPoints.padX}
                y1={g.y}
                y2={g.y}
              />
            ))}
            <ChartPath d={chartPoints.path} />
            {chartPoints.points.map((p, idx) => (
              <g key={`pt-${idx}`}>
                <ChartDot cx={p.x} cy={p.y} />
                <ChartDotLabel as="text" x={p.x} y={p.y - 12}>
                  {p.value}
                </ChartDotLabel>
                <ChartBarLabel as="text" x={p.x} y={chartPoints.height - 6}>
                  {p.label}
                </ChartBarLabel>
              </g>
            ))}
          </ChartSvg>
        </Box>
      )}
    </MoodChart>
  );
};
