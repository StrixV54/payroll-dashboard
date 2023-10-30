import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { ColorConstant, StylesConstant } from "../utils/constants";
import GraphBar from "./charts/GraphBar";
import PieChart from "./charts/PieChart";
import { barData, lineDataMonth, lineDataYear, pieData } from "./charts/data";
import LineChart from "./charts/LineChart";
import MenuButton from "./MenuButton";
import { useState } from "react";

type GraphCoverage = "year" | "month";

export default function Dashboard() {
  const [graphCoverage, setGraphCoverage] = useState<GraphCoverage>("year");

  const handleCoverage = () => {
    setGraphCoverage((prev) => (prev === "year" ? "month" : "year"));
  };

  return (
    <Box
      sx={{
        ...StylesConstant.fullScreenCover,
        flexGrow: 1,
        display: "flex",
      }}
      bgcolor={ColorConstant.BLACK}
    >
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Paper
            sx={{
              padding: 3,
              backgroundColor: ColorConstant.TEAL_BG,
              height: "210px",
              borderRadius: 3,
              position: "relative",
              backgroundImage: "none",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              ...StylesConstant.gradientEffectDark,
            }}
          >
            <Box
              sx={{
                display: "flex",
                width: "100%",
                justifyContent: "flex-end",
                zIndex: 10,
              }}
            >
              <MenuButton />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "flex-end",
              }}
            >
              <Typography fontSize="1.8rem" variant="body1" fontWeight="bold">
                $543.51
              </Typography>
              <Typography fontSize="1.2rem">Total Profit Margin</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper
            sx={{
              padding: 3,
              backgroundColor: ColorConstant.TEAL_BG,
              height: "210px",
              borderRadius: 3,
              position: "relative",
              display: "flex",
              flexDirection: "row",
              overflow: "hidden",
              backgroundImage: "none",
              ...StylesConstant.gradientEffectLight,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography fontSize="1.2rem">Global Spike</Typography>
                <Typography fontSize="1.5rem" variant="body1" fontWeight="bold">
                  $342.33
                </Typography>
              </Box>
              <Box
                sx={{
                  flexDirection: "row",
                  flexWrap: "nowrap",
                  width: "180px",
                }}
              >
                <Button
                  onClick={handleCoverage}
                  sx={{
                    fontSize: "0.7rem",
                    backgroundColor:
                      graphCoverage === "year"
                        ? ColorConstant.TEAL_LIGHT_HOVER_BG
                        : "none",
                    color: ColorConstant.WHITE,
                  }}
                >
                  Year
                </Button>
                <Button
                  onClick={handleCoverage}
                  sx={{
                    fontSize: "0.7rem",
                    ml: 1,
                    backgroundColor:
                      graphCoverage === "month"
                        ? ColorConstant.TEAL_LIGHT_HOVER_BG
                        : "none",
                    color: ColorConstant.WHITE,
                  }}
                >
                  Month
                </Button>
              </Box>
            </Box>
            <LineChart
              data={graphCoverage === "year" ? lineDataYear : lineDataMonth}
            />
          </Paper>
        </Grid>
        <Grid item xs={8}>
          <Paper
            sx={{
              backgroundColor: ColorConstant.TEAL_BG,
              padding: 3,
              borderRadius: 3,
              backgroundImage: "none",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography fontSize="0.8rem">Total Growth:</Typography>
              <Typography fontSize="1.5rem" variant="body1" fontWeight="bold">
                $2,342.33
              </Typography>
            </Box>
            <Box height={500}>
              <GraphBar data={barData} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper
            sx={{
              height: 300,
              backgroundColor: ColorConstant.TEAL_BG,
              padding: 3,
              borderRadius: 3,
              backgroundImage: "none",
            }}
          >
            <Typography fontSize="1.2rem">Department</Typography>
            <PieChart data={pieData} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
