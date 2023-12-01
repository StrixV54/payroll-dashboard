import { Box, Grid, Paper, Typography, useTheme } from "@mui/material";
import { ColorConstant, StylesConstant } from "../../utils/constants";
import { GraphBarWithLabel } from "../charts/GraphBar";
import PieChart from "../charts/PieChart";
import { useEffect, useState } from "react";
import {
  getEmployeesStatusAPI,
  salaryAnalyticsDepartmentAPI,
} from "../../firebase/api";
import { LoadingSection } from "../../pages/Loading";

interface PieDataProps {
  id: string;
  label: string;
  value: number;
}

interface SalaryMonthWiseDataProps {
  month: string;
  Sales: number;
  Finance: number;
  HR: number;
  "IT Support": number;
  Marketing: number;
  Engineering: number;
}

export default function Manager() {
  const theme = useTheme();
  const [pieGraphEmployeesStatusData, setPieGraphEmployeesStatusData] =
    useState<PieDataProps[]>([]);
  const [barGraphSalaryMonthWiseData, setBarGraphSalaryMonthWiseData] =
    useState<SalaryMonthWiseDataProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    //Fetch user detail
    const fetch = async () => {
      const salaryAnalyticsMonthWise = await salaryAnalyticsDepartmentAPI(
        "2023"
      );
      const employeesStatusData = await getEmployeesStatusAPI();
      setPieGraphEmployeesStatusData(employeesStatusData);
      setBarGraphSalaryMonthWiseData(
        salaryAnalyticsMonthWise as SalaryMonthWiseDataProps[]
      );
      setIsLoading(false);
    };
    fetch();
  }, []);

  return isLoading ? (
    <LoadingSection message="Loading... Please wait" />
  ) : (
    <Box
      sx={{
        ...StylesConstant.fullScreenCover,
        flexGrow: 1,
        display: "flex",
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper
            sx={{
              backgroundColor: theme.palette.background.paper,
              padding: 3,
              boxShadow: "none",
              borderRadius: 3,
              backgroundImage: "none",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography fontSize="1.0rem" mb={2}>
                Department Analytics for year 2023
              </Typography>
            </Box>
            <Box height={300}>
              <GraphBarWithLabel
                data={barGraphSalaryMonthWiseData}
                keys={[
                  "Engineering",
                  "Finance",
                  "HR",
                  "IT Support",
                  "Marketing",
                  "Sales",
                ]}
                xaxis="Month"
                yaxis="Total Salary"
                indexBy="month"
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={5}>
          <Paper
            sx={{
              height: 400,
              backgroundColor: theme.palette.background.paper,
              padding: 3,
              borderRadius: 3,
              backgroundImage: "none",
              boxShadow: "none",
            }}
          >
            <Typography fontSize="1.2rem">
              Employees Status
              <Typography
                component={"span"}
                fontSize="0.8rem"
                sx={{ color: ColorConstant.GRAY }}
              >
                {" "}
                (No of Employee)
              </Typography>
            </Typography>
            <PieChart data={pieGraphEmployeesStatusData} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
