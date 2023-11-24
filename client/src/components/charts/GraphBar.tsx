import { useTheme } from "@mui/material";
import { BarDatum, ResponsiveBar } from "@nivo/bar";

export default function GraphBar({
  data,
  keys,
  xaxis,
  yaxis,
  indexBy,
}: {
  data: Array<object>;
  keys: Array<string>;
  xaxis: string;
  yaxis: string;
  indexBy: string;
}) {
  const theme = useTheme();

  return (
    <ResponsiveBar
      data={data as BarDatum[]}
      theme={{
        textColor: theme.palette.text.primary,
      }}
      keys={keys}
      indexBy={indexBy}
      margin={{ top: 50, right: 30, bottom: 50, left: 30 }}
      padding={0.3}
      groupMode="stacked"
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "paired" }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 6,
        tickPadding: 6,
        tickRotation: 0,
        legend: xaxis,
        legendPosition: "middle",
        legendOffset: 45,
      }}
      axisLeft={{
        tickSize: 0,
        tickPadding: 5,
        tickValues: [],
        tickRotation: 0,
        legend: yaxis,
        legendPosition: "middle",
        legendOffset: -10,
      }}
      enableGridY={false}
      isInteractive={false}
      enableLabel={true}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      legends={[]}
      role="application"
    />
  );
}
