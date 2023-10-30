import { ResponsiveLine, Serie } from "@nivo/line";
import { Fragment } from "react";

export default function LineChart({ data }: { data: Serie[] }) {
  return (
    <Fragment>
      <ResponsiveLine
        data={data}
        margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: true,
          reverse: false,
        }}
        curve="cardinal"
        axisTop={null}
        axisRight={null}
        axisBottom={null}
        axisLeft={null}
        enableGridX={false}
        lineWidth={4}
        enableGridY={false}
        enablePoints={false}
        pointSize={10}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor", modifiers: [] }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[]}
      />
    </Fragment>
  );
}
