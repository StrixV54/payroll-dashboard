import { RadialBarSerie, ResponsiveRadialBar } from "@nivo/radial-bar";

export default function RadialChart({ data }: { data: RadialBarSerie[] }) {
  return (
    <ResponsiveRadialBar
      data={data}
      valueFormat=">-.2f"
      padding={0.4}
      cornerRadius={2}
      theme={{
        textColor: "#ffffff",
      }}
      margin={{ top: 40, right: 120, bottom: 40, left: 40 }}
      radialAxisStart={{ tickSize: 5, tickPadding: 5, tickRotation: 0 }}
      circularAxisOuter={{ tickSize: 5, tickPadding: 12, tickRotation: 0 }}
      legends={[]}
    />
  );
}
